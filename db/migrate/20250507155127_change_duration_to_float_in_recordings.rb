class ChangeDurationToFloatInRecordings < ActiveRecord::Migration[7.2]
  def change
    change_column :recordings, :duration, :float
  end
end
