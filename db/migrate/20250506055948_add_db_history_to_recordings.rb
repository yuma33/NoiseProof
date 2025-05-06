class AddDbHistoryToRecordings < ActiveRecord::Migration[7.2]
  def change
    add_column :recordings, :db_history, :jsonb
  end
end
