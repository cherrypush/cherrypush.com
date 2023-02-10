# frozen_string_literal: true

class CreateNewOccurrences < ActiveRecord::Migration[7.0]
  def change
    create_table :occurrences do |t|
      t.string :name
      t.string :url
      t.references :report, null: false, foreign_key: true

      t.timestamps
    end
  end
end
