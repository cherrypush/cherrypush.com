class RemoveLineContentFromOccurrences < ActiveRecord::Migration[7.0]
  def change
    remove_column :occurrences, :line_content, :string
  end
end
