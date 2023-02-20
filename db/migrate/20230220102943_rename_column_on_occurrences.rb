# frozen_string_literal: true

class RenameColumnOnOccurrences < ActiveRecord::Migration[7.0]
  def change
    rename_column :occurrences, :name, :text
  end
end
