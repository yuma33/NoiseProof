class AddTitleToNoiseReports < ActiveRecord::Migration[7.2]
  def change
    add_column :noise_reports, :title, :string
  end
end
