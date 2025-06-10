class AddFromNoiseReports < ActiveRecord::Migration[7.2]
  def change
    add_column :noise_reports, :location, :string
  end
end
