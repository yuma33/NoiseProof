class CertificatesController < ApplicationController
  def create
    @report_ids = params[:report_ids]


    if @report_ids.blank?
      redirect_to request.referer || root_path, alert: "レポートを選択してください"
      return
    end

    unique_number = SecureRandom.hex(6).upcase

    @certificate = Certificate.new(
      user: current_user,
      certificate_number: unique_number
    )

    unless @certificate.save
      redirect_to noise_reports_path, danger: t("defaults.flash_message.success_noise_report", item: Certificate.model_name.human)
    end


    reports = NoiseReport.where(id: @report_ids)
    @certificate.noise_reports << reports

    if @certificate.noise_reports.where(id: @report_ids).count == @report_ids.size
        redirect_to certificate_path(@certificate)
    end
  end

  def show
    @certificate = Certificate.includes(noise_reports: [ :recording ]).find(params[:id])
  end

  private

  def certificate_params
    params.permit(report_ids: [])
  end
end
