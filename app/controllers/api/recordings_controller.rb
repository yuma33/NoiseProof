module Api
  class RecordingsController < BaseController
    def create
      recording = current_user.recordings.new(recording_params)
      recording.audio_file.attach(params[:audio])
      recording.db_history = JSON.parse(params[:db_history]) if params[:db_history].present?
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
      result = params.permit(:duration, :recorded_at, :max_decibel, :average_decibel, :db_history)
      result[:duration] = result[:duration].to_f
      result
    end
  end
end
