# frozen_string_literal: true

class OrganizationPolicy < ApplicationPolicy
  def read?
    return true if user.admin?
    return true if record.name == "cherrypush"
    return true if record.user == user
    return true if user.authorizations.where(organization: record).any?
    false
  end

  def destroy?
    return true if user.admin?
    record.user == user
  end
end
