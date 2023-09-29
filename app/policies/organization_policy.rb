# frozen_string_literal: true

class OrganizationPolicy < ApplicationPolicy
  def read_access?
    return true if user.admin?
    return true if record.name == "cherrypush" # This is the demo organization, so everyone can access it
    return true if record.user == user
    return true if user.authorizations.where(organization: record).any?
    false
  end

  def write_access?
    return true if user.admin?
    return true if record.user == user
    return true if user.authorizations.where(organization: record).any?
    false
  end

  def destroy?
    return true if user.admin?
    record.user == user
  end
end
