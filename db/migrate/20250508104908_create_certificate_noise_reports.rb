class CreateCertificateNoiseReports < ActiveRecord::Migration[7.2]
  def change
    create_table :certificate_noise_reports do |t|
      t.references :certificate, null: false, foreign_key: true
      t.references :noise_report, null: false, foreign_key: true

      t.timestamps
    end

    add_index :certificate_noise_reports, [ :certificate_id, :noise_report_id ], unique: true
  end
end
