# frozen_string_literal: true

class Organization < ApplicationRecord
  belongs_to :user
  has_many :memberships
  has_many :authorizations, dependent: :destroy

  validates :name, presence: true

  def team_plan?
    memberships.any?
  end

  def organization_plan?
    memberships.organization_kind.any?
  end

  def can_create_new_authorizations?
    return false, "A paid plan is required to create new authorizations." if memberships.empty?
    return false, "Upgrade your plan to create new authorizations." if team_plan? && authorizations.count >= 10

    true
  end

  def users
    User.where(id: authorizations.pluck(:user_id) + [user_id])
  end
end
