class AddPlaceIdToRecordings < ActiveRecord::Migration[7.2]
  def change
    add_column :recordings, :place_id, :string
  end
end
