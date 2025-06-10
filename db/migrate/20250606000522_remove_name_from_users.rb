class RemoveNameFromUsers < ActiveRecord::Migration[7.2]
  def change
    remove_column :users, :first_name, :string
    remove_column :users, :last_name, :string
  end
end
