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
    @noise_reports_by_date = current_user.noise_reports.group_by { |noise_report|
    noise_report.created_at&.to_date
  }.sort.reverse.to_h
  end

  def edit
    @noise_report = current_user.noise_reports.find(params[:id])
  end

  def update
    @noise_report = current_user.noise_reports.find(params[:id])
    if @noise_report.update(edit_noise_report_params)
      redirect_to noise_report_path(@noise_report), success: t("defaults.flash_message.success_edit_noise_report", item: NoiseReport.model_name.human)
    else
      @noise_report = current_user.noise_reports.find(params[:id])
      flash.now[:danger]= t("defaults.flash_message.not_success_edit_noise_report", item: NoiseReport.model_name.human)
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @noise_report = current_user.noise_reports.find(params[:id])
    if @noise_report.destroy!
      redirect_to noise_reports_path, success: t("defaults.flash_message.destroy_noise_report", item: NoiseReport.model_name.human), status: :see_other
    end
  end

  private
  def noise_report_params
    params_hash = params.require(:noise_report).permit(:location, :time_period, :frequency, :noise_type, :memo, :title, :recording_id).merge(recording_id: params[:recording_id])
    params_hash[:noise_type] = params_hash[:noise_type].to_i if params_hash[:noise_type].present?
    params_hash[:frequency] = params_hash[:frequency].to_i if params_hash[:frequency].present?
    params_hash
  end

  def edit_noise_report_params
    params_hash = params.require(:noise_report).permit(:title, :location, :noise_type, :frequency, :memo)
    params_hash[:noise_type] = params_hash[:noise_type].to_i if params_hash[:noise_type].present?
    params_hash[:frequency] = params_hash[:frequency].to_i if params_hash[:frequency].present?
    params_hash
  end
end
