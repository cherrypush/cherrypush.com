# frozen_string_literal: true

class RemoveProjectIdFromAuthorizationRequests < ActiveRecord::Migration[7.0]
  def change
    remove_reference :authorization_requests, :project, null: false, foreign_key: true
  end
end
