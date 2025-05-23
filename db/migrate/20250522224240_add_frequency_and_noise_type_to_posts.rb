class AddFrequencyAndNoiseTypeToPosts < ActiveRecord::Migration[7.2]
  def change
    add_column :posts, :frequency, :integer, default: 0
    add_column :posts, :noise_type, :integer, default: 0
  end
end
