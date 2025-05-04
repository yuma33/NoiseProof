class NoiseReportRecording < ApplicationRecord
  belongs_to :noise_report
  belongs_to :recording
end
