# frozen_string_literal: true

class ChangeTypeOfValueForReports < ActiveRecord::Migration[7.0]
  def change
    change_table :reports do |t|
      t.change :value, :float
    end
  end
end
