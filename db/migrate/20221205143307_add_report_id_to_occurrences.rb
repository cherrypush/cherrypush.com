# frozen_string_literal: true

class AddReportIdToOccurrences < ActiveRecord::Migration[7.0]
  def change
    Occurrence.destroy_all
    add_reference :occurrences, :report, null: false, foreign_key: true
    remove_column :occurrences, :project_id
  end
end
