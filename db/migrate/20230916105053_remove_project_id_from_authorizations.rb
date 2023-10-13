# frozen_string_literal: true

class RemoveProjectIdFromAuthorizations < ActiveRecord::Migration[7.0]
  def change
    remove_column :authorizations, :project_id
  end
end
