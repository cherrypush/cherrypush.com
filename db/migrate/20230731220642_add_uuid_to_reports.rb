# frozen_string_literal: true

class AddUuidToReports < ActiveRecord::Migration[7.0]
  def change
    add_column :reports, :uuid, :uuid
  end
end
