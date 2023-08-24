class AddFavoriteDashboardIdsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :favorite_dashboard_ids, :integer, array: true, default: []
  end
end
