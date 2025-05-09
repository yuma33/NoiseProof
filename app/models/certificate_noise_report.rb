class CertificateNoiseReport < ApplicationRecord
  belongs_to :certificate
  belongs_to :noise_report
end
