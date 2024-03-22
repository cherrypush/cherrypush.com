# frozen_string_literal: true

class AuthorizationPolicy < ApplicationPolicy
  def destroy?
    return true if user.admin?

    user.organizations.include?(record.organization)
  end
end
