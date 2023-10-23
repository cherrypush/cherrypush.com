# frozen_string_literal: true

class MembershipBelongsToOrganization < ActiveRecord::Migration[7.0]
  def change
    Membership.destroy_all
    add_reference :memberships, :organization, null: false, foreign_key: true
    remove_column :memberships, :user_id, :bigint
  end
end
