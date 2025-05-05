class RecordingsController < ApplicationController
  skip_before_action :require_login, only: %i[home]

  def home; end

  def index
    @recordings_by_date = current_user.recordings.group_by { |recording|
    recording.recorded_at&.to_date
  }
  end

  def destroy
    @recording = current_user.recordings.find(params[:id])
    if @recording.destroy!
      redirect_to recordings_path, success: t("defaults.flash_message.destroy_recording", item: Recording.model_name.human), status: :see_other
    end
  end
end
