# frozen_string_literal: true

class RemoveNameFromCharts < ActiveRecord::Migration[7.0]
  def change
    remove_column :charts, :name, :string
  end
end
