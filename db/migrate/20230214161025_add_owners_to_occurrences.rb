# frozen_string_literal: true

class AddOwnersToOccurrences < ActiveRecord::Migration[7.0]
  def change
    add_column :occurrences, :owners, :string, array: true
  end
end
