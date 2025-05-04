class Recording < ApplicationRecord
  belongs_to :user
  has_one_attached :audio_file
  has_many :noise_report_recordings
  has_many :noise_reports, through: :noise_report_recordings
end
