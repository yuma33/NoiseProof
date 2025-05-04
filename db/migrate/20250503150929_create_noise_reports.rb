class CreateNoiseReports < ActiveRecord::Migration[7.2]
  def change
    create_table :noise_reports do |t|
      t.references :user, foreign_key: true
      t.string :location
      t.string :time_period
      t.string :frequency
      t.string :noise_type
      t.text :memo

      t.timestamps
    end
  end
end
