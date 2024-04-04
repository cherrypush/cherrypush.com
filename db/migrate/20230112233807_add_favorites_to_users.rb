# frozen_string_literal: true

class AddFavoritesToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :favorite_project_ids, :integer, array: true, default: []
    add_column :users, :favorite_metric_names, :string, array: true, default: []
    add_column :users, :favorite_owner_handles, :string, array: true, default: []
  end
end
