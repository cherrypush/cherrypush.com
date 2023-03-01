class AddFavoriteMetricIdsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :favorite_metric_ids, :integer, array: true, default: []
  end
end
