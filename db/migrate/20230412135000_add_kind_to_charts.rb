# frozen_string_literal: true

class AddKindToCharts < ActiveRecord::Migration[7.0]
  def change
    add_column :charts, :kind, :string
  end
end
