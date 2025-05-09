class CreateCertificates < ActiveRecord::Migration[7.2]
  def change
    create_table :certificates do |t|
      t.string :title
      t.references :user, null: false, foreign_key: true
      t.string :certificate_number

      t.timestamps
    end

    add_index :certificates, :certificate_number, unique: true
  end
end