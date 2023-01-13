# frozen_string_literal: true

class RemoveColumnFromProjects < ActiveRecord::Migration[7.0]
  def change
    remove_column :projects, :access
  end
end
