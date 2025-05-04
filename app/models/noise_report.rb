class NoiseReport < ApplicationRecord
  belongs_to :user
  has_many :recordings, through: :noise_report_recordings
end
