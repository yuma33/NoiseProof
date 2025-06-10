class RemoveTitleNoteLocationFromRecordings < ActiveRecord::Migration[7.2]
  def change
    remove_column :recordings, :title, :string
    remove_column :recordings, :note, :text
    remove_column :recordings, :location, :string
  end
end
