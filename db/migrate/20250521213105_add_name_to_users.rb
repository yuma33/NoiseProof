class AddNameToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :name, :string
    change_column_null :users, :first_name, true
  end
end
