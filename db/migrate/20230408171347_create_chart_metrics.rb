# frozen_string_literal: true

class CreateChartMetrics < ActiveRecord::Migration[7.0]
  def change
    create_table :chart_metrics do |t|
      t.references :chart, null: false, foreign_key: true
      t.references :metric, null: false, foreign_key: true

      t.timestamps
    end
  end
end
