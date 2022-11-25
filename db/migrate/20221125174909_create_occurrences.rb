class CreateOccurrences < ActiveRecord::Migration[7.0]
  def change
    create_table :occurrences do |t|
      t.string :metric_name
      t.string :commit_sha
      t.string :file_path
      t.integer :line_number
      t.string :line_content
      t.string :repo
      t.string :owners, array: true, default: []

      t.timestamps
    end
  end
end
