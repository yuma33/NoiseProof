class Change < ActiveRecord::Migration[7.2]
  def change
    change_column_null :users, :last_name, true
  end
end
