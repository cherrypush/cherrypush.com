# frozen_string_literal: true

class ProjectPolicy < ApplicationPolicy
  def read?
    return true if user.admin?
    return true if record.name == 'demo/project'
    return true if record.user == user
    return true if user.authorizations.where(project: record).any?
    false
  end

  def destroy?
    record.user == user
  end

  class Scope < Scope
    def resolve
      return scope.all if user.admin?
      scope.includes(:authorizations).where(authorizations: { user: user }).or(scope.where(user: user))
    end
  end
end
