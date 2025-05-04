class RecordingsController < ApplicationController
  skip_before_action :require_login, only: %i[home]

  def home; end

  def index
    @recordings_by_date = current_user.recordings.group_by { |recording|
    recording.recorded_at&.to_date
  }
  end
end
