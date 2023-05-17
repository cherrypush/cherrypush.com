class AddSubscribersToMetrics < ActiveRecord::Migration[7.0]
  def change
    add_column :metrics, :watcher_ids, :integer, array: true, default: []
  end
end
