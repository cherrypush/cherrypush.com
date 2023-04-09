# frozen_string_literal: true

class CreateCharts < ActiveRecord::Migration[7.0]
  def change
    create_table :charts do |t|
      t.string :name
      t.references :dashboard, null: false, foreign_key: true

      t.timestamps
    end
  end
end
