class Certificate < ApplicationRecord
  belongs_to :user
  has_many :certificate_noise_reports, dependent: :destroy
  has_many :noise_reports, through: :certificate_noise_reports
end
