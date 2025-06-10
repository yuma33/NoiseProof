class Recording < ApplicationRecord
  belongs_to :user
  has_one_attached :audio_file, dependent: :destroy
  has_one :noise_report, dependent: :destroy

end
