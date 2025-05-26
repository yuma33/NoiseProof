class Certificate < ApplicationRecord
  belongs_to :user
  has_many :certificate_noise_reports, dependent: :destroy
  has_many :noise_reports, through: :certificate_noise_reports

  def total_recording_duration
    noise_reports.joins(:recording).sum("recordings.duration")
  end

  def total_noise_reports
    noise_reports.count
  end

  def total_recording_max_decibel
    noise_reports.joins(:recording).maximum("recordings.max_decibel")
  end

  def total_recording_average_decibel
    noise_reports.joins(:recording).average("recordings.average_decibel").round(1)
  end

  def self.ransackable_attributes(auth_object = nil)
    [ "certificate_number", "created_at", "id", "id_value", "title", "updated_at" ]
  end
end
