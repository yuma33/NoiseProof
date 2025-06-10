class Recording < ApplicationRecord
  belongs_to :user
  has_one_attached :audio_file, dependent: :destroy
  has_one :noise_report, dependent: :destroy

  validates :user_id, presence: true
  validates :duration, presence: true, numericality: true
  validates :max_decibel, presence: true, numericality: true
  validates :average_decibel, presence: true, numericality: true
  validates :latitude, numericality: true, allow_nil: true
  validates :longitude, numericality: true, allow_nil: true
end
