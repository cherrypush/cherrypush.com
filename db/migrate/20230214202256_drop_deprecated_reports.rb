# frozen_string_literal: true

class DropDeprecatedReports < ActiveRecord::Migration[7.0]
  def change
    drop_table :deprecated_reports
  end
end
