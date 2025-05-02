class CreateRecordings < ActiveRecord::Migration[7.2]
  def change
    create_table :recordings do |t|
      t.string :title
      t.text :note
      t.float :latitude
      t.float :longitude
      t.string :location
      t.datetime :recorded_at
      t.integer :duration
      t.float :max_decibel
      t.float :average_decibel
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
