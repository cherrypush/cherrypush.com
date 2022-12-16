# frozen_string_literal: true

class DropTableOccurrences < ActiveRecord::Migration[7.0]
  def change
    drop_table :occurrences
  end
end
