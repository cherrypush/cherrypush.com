# frozen_string_literal: true

class AddProjectIdToOccurrences < ActiveRecord::Migration[7.0]
  def change
    Occurrence.destroy_all
    add_reference :occurrences, :project, null: false, foreign_key: true
  end
end
