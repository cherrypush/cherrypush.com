# frozen_string_literal: true

class AddDefaultValueToValueByOwner < ActiveRecord::Migration[7.0]
  def change
    change_column_default :reports, :value_by_owner, {}
  end
end
