# frozen_string_literal: true

class RemoveUserIdFromAuthorizations < ActiveRecord::Migration[7.0]
  def change
    remove_column :authorizations, :user_id
  end
end
