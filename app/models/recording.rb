class Recording < ApplicationRecord
  belongs_to :user
  has_one_attached :audio_file
  has_one :noise_report
end
