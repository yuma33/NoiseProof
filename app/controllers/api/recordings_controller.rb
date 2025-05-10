module Api
  class RecordingsController < BaseController
    def create
      recording = current_user.recordings.new(recording_params)
      recording.audio_file.attach(params[:audio])
      recording.db_history = JSON.parse(params[:db_history]) if params[:db_history].present?

      if params[:latitude].present? && params[:longitude].present?
        recording.latitude = params[:latitude]
        recording.longitude = params[:longitude]
        recording.place_id = reverse_geocode(params[:latitude], params[:longitude])
      end

    if recording.save
      render json: { message: "保存成功", recording: recording }, status: :created
    else
      render json: { error: recording.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    recording = Recording.find(params[:id])
    render json: {
      audio_url: url_for(recording.audio_file),
      db_history: recording&.db_history || [],
      duration:  recording&.duration || []
    }
  end

    private

    def recording_params
      result = params.permit(:duration, :recorded_at, :max_decibel, :average_decibel, :db_history, :latitude, :longitude)
      result[:duration] = result[:duration].to_f
      result
    end

    def reverse_geocode(lat, lng)
      api_key = ENV['GOOGLE_MAPS_API_KEY']
      url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=#{lat},#{lng}&key=#{api_key}&language=ja"
      begin
        response = HTTP.get(url)
        parsed = JSON.parse(response.body.to_s)
        if parsed["status"] == "OK" && parsed["results"].present?
          parsed["results"][0]["place_id"]
        else
          nil
        end
      rescue => e
        Rails.logger.error("Geocoding error: #{e.message}")
        nil
      end
    end
  end
end
