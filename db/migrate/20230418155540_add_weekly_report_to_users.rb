# frozen_string_literal: true

class AddWeeklyReportToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :weekly_report, :boolean, default: true
  end
end
