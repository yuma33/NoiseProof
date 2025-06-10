class NoiseReport < ApplicationRecord
  belongs_to :user
  belongs_to :recording

  has_many :certificate_noise_reports, dependent: :destroy
  has_many :certificates, through: :certificate_noise_reports

  validates :user_id, presence: true
  validates :recording_id, presence: true
  validates :title, presence: true, length: { maximum: 255 }
  validates :frequency, presence: true
  validates :noise_type, presence: true
  validates :memo, length: { maximum: 1000 }, allow_blank: true
  validates :location, length: { maximum: 255 }, allow_blank: true

  enum :noise_type, { noise_type_other: 0, footstep: 1, appliance: 2, human_voice: 3,  entertainment: 4, impact: 5, pet: 6, external: 7 }
  enum :frequency, { frequency_other: 0, daily: 1, weekly: 2, few: 3, irregular: 4 }

  def self.ransackable_attributes(auth_object = nil)
    [ "created_at", "frequency", "id", "id_value", "location", "memo", "noise_type", "recording_id", "time_period", "title", "updated_at" ]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "certificate_noise_reports", "certificates", "recording", "user" ]
  end
end
