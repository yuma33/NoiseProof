class RemoveTitleFromCertificates < ActiveRecord::Migration[7.2]
  def change
    remove_column :certificates, :title, :string
  end
end
