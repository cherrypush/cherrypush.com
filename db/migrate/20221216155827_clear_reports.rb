# frozen_string_literal: true

class ClearReports < ActiveRecord::Migration[7.0]
  def change
    Report.destroy_all
  end
end
