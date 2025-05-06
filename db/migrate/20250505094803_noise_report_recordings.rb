class NoiseReportRecordings < ActiveRecord::Migration[7.2]
  def change
    drop_table :noise_report_recordings
  end
end
