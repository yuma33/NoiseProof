class CertificatesController < ApplicationController
  def index
    @certificates_by_date = current_user.certificates.group_by { |certificate|
    certificate.created_at&.to_date
  }.sort.reverse.to_h
  end

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
    raw_counts = @certificate.noise_reports.group(:noise_type).count

    @noise_type_distribution = raw_counts.transform_keys do |key|
      NoiseReport.noise_types_i18n[key]
    end

    @report_counts = @certificate.noise_reports
                                  .group_by_hour_of_day(:created_at)
                                  .count

    @max_dbs = @certificate.noise_reports
                                  .joins(:recording)
                                  .group_by_hour_of_day(:created_at)
                                  .maximum("recordings.max_decibel")
  end

  def destroy
    @certificate = current_user.certificates.find(params[:id])
    if @certificate.destroy!
      redirect_to certificates_path, success: t("defaults.flash_message.destroy_certificate", item: Certificate.model_name.human), status: :see_other
    end
  end

  private

  def certificate_params
    params.permit(report_ids: [])
  end
end
