class CreateNoiseReportRecordings < ActiveRecord::Migration[7.2]
  def change
    create_table :noise_report_recordings do |t|
      t.references :noise_report, null: false, foreign_key: true
      t.references :recording, null: false, foreign_key: true

      t.timestamps
    end
  end
end
