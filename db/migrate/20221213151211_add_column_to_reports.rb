class AddColumnToReports < ActiveRecord::Migration[7.0]
  def change
    Report.destroy_all
    add_column :reports, :commit_date, :datetime, null: false
  end
end
