# frozen_string_literal: true

class RemoveColumnsFromOccurrences < ActiveRecord::Migration[7.0]
  def change
    remove_column :occurrences, :commit_sha, :string
  end
end
