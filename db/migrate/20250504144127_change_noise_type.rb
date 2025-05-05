class ChangeNoiseType < ActiveRecord::Migration[7.2]
  def change
    change_column :noise_reports, :noise_type, :integer, default: 0, using: 'noise_type::integer'
    change_column :noise_reports, :frequency, :integer, default: 0, using: 'noise_type::integer'
  end
end
