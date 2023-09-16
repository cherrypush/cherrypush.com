# frozen_string_literal: true

class Organization < ApplicationRecord
  belongs_to :user
  has_many :memberships

  validates :name, presence: true

  def team_plan?
    memberships.any?
  end

  def organization_plan?
    memberships.organization_kind.any?
  end
end
