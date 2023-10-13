# frozen_string_literal: true

class ChangeAssociationsFromAuthorizationRequests < ActiveRecord::Migration[7.0]
  def change
    AuthorizationRequest.all.each do |authorization_request|
      if authorization_request.project.organization_id
        authorization_request.update!(organization_id: authorization_request.project.organization_id)
      else
        authorization_request.destroy!
      end
    end

    add_reference :authorization_requests, :organization, null: false, foreign_key: true
  end
end
