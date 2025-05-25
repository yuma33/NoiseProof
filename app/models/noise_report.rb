class NoiseReport < ApplicationRecord
  belongs_to :user
  belongs_to :recording

  has_many :certificate_noise_reports, dependent: :destroy
  has_many :certificates, through: :certificate_noise_reports

  enum :noise_type, { noise_type_other: 0, footstep: 1, appliance: 2, human_voice: 3,  entertainment: 4, impact: 5, pet: 6, external: 7 }
  enum :frequency, { frequency_other: 0, daily: 1, weekly: 2, few: 3, irregular: 4 }

  def self.human_enum_name(enum_name, key)
    I18n.t("enums.#{model_name.i18n_key}.#{enum_name}.#{key}")
  end

  def self.ransackable_attributes(auth_object = nil)
    [ "created_at", "frequency", "id", "id_value", "location", "memo", "noise_type", "recording_id", "time_period", "title", "updated_at", "user_id" ]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "certificate_noise_reports", "certificates", "recording", "user" ]
  end
end
