# frozen_string_literal: true

class AddMetricsToReports < ActiveRecord::Migration[7.0]
  def change
    add_column :reports, :metrics, :jsonb
  end
end
