# frozen_string_literal: true

class RemoveWatcherIdsFromMetrics < ActiveRecord::Migration[7.1]
  def change
    remove_column :metrics, :watcher_ids, :integer, array: true, default: []
  end
end
