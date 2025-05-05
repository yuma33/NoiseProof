class AddRecordingToNoiseReports < ActiveRecord::Migration[7.2]
  def change
    add_reference :noise_reports, :recording, null: false, foreign_key: true
  end
end
