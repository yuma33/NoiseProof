class NoiseReportsController < ApplicationController
  def new
    @noise_report = NoiseReport.new
    @recording = current_user.recordings.find(params[:recording_id])
  end

  def quick_new
    @noise_report = NoiseReport.new
    @recording = current_user.recordings.last
    if @recording
      redirect_to new_recording_noise_report_path(@recording)
    else
      redirect_to root_path, danger: t("defaults.flash_message.bad_request", item: NoiseReport.model_name.human)
    end
  end

  def create
    @recording = current_user.recordings.find(params[:recording_id])
    @noise_report = current_user.noise_reports.new(noise_report_params)
    if @noise_report.save
      redirect_to noise_report_path(@noise_report), success: t("defaults.flash_message.success_noise_report", item: NoiseReport.model_name.human)
    else
      flash.now[:danger]= t("defaults.flash_message.not_success_noise_report", item: NoiseReport.model_name.human)
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @noise_report = current_user.noise_reports.find(params[:id])
  end

  def index
    noise_reports = current_user.noise_reports

    if noise_reports.blank?
      @noise_reports_by_date = {}
    else
    @noise_reports_by_date = current_user.noise_reports.group_by { |noise_report|
    noise_report.created_at&.to_date
  }.sort.reverse.to_h
    end
  end

  private
  def noise_report_params
    params_hash = params.require(:noise_report).permit(:location, :time_period, :frequency, :noise_type, :memo, :title, :recording_id).merge(recording_id: params[:recording_id])
    params_hash[:noise_type] = params_hash[:noise_type].to_i if params_hash[:noise_type].present?
    params_hash[:frequency] = params_hash[:frequency].to_i if params_hash[:frequency].present?
    params_hash
  end
end
