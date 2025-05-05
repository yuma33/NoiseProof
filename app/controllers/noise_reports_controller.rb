class NoiseReportsController < ApplicationController
  def new
    @noise_report = NoiseReport.new
    @recording = current_user.recordings.find(params[:recording_id])
  end
end
