# frozen_string_literal: true

class AddOrganizationReferenceToAuthorizations < ActiveRecord::Migration[7.0]
  def change
    add_reference :authorizations, :organization, null: true, foreign_key: true

    Authorization.all.each do |authorization|
      if authorization.project.organization_id
        authorization.update!(organization_id: authorization.project.organization_id)
      else
        puts "deleting authorization without organization"
        puts "project: #{authorization.project.name}, user: #{authorization.user.name}"
        authorization.destroy!
      end
    end

    change_column_null :authorizations, :organization_id, false
  end
end
