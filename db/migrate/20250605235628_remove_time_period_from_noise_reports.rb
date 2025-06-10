class RemoveTimePeriodFromNoiseReports < ActiveRecord::Migration[7.2]
  def change
    remove_column :noise_reports, :time_period, :string
  end
end
