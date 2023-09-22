# frozen_string_literal: true

class ProjectPolicy < ApplicationPolicy
  def read?
    return true if user.admin?
    return true if record.name == "cherrypush/cherry"
    return true if record.user == user
    return true if user.organizations.include?(record.organization)
    false
  end

  def destroy?
    return true if user.admin?
    record.user == user
  end
end
