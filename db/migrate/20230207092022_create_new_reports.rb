# frozen_string_literal: true

class CreateNewReports < ActiveRecord::Migration[7.0]
  def change
    rename_table :reports, :deprecated_reports

    create_table :reports do |t|
      t.timestamp :date
      t.bigint :value
      t.jsonb :value_by_owner
      t.references :metric, null: false, foreign_key: true

      t.timestamps
    end
  end
end
