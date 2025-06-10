class CertificateNoiseReport < ApplicationRecord
  belongs_to :certificate
  belongs_to :noise_report

  validates :certificate_id, presence: true
  validates :noise_report_id, presence: true
  validates :noise_report_id, uniqueness: { scope: :certificate_id }
end
