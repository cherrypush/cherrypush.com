# frozen_string_literal: true

class Organization < ApplicationRecord
  belongs_to :user
  has_many :memberships
  has_many :authorizations, dependent: :destroy

  validates :name, presence: true

  def can_create_new_authorizations?
    return false, "A paid plan is required to create authorizations. Reach out to #{user.name}." if memberships.empty?

    true
  end

  def users
    User.where(id: authorizations.pluck(:user_id) + [user_id])
  end
end
