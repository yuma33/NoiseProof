module Api
  class RecordingsController < BaseController
    def create
      recording = current_user.recordings.new(recording_params)
      recording.audio_file.attach(params[:audio])
    if recording.save
      render json: { message: "保存成功", recording: recording }, status: :created
    else
      render json: { error: recording.errors.full_messages }, status: :unprocessable_entity
    end
  end

    private

    def recording_params
      result = params.permit(:duration)
      result[:duration] = result[:duration].to_i
      result
    end
  end
end
