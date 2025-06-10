class RemoveFromNoiseReports < ActiveRecord::Migration[7.2]
  def change
    remove_column :noise_reports, :location, :string
  end
end
