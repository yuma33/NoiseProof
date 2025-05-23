class AddUserToPosts < ActiveRecord::Migration[7.2]
  def change
    add_reference :posts, :user, null: false, foreign_key: true
  end
end
