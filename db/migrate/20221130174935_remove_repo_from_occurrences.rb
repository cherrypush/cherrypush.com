class RemoveRepoFromOccurrences < ActiveRecord::Migration[7.0]
  def change
    remove_column :occurrences, :repo
  end
end
