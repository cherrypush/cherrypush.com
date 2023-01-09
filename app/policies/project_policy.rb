# frozen_string_literal: true

class ProjectPolicy < ApplicationPolicy
  def read?
    return true if record.access == 'public'
    return true if record.user == user
    return true if user.authorizations.where(project: record).any?
    false
  end

  class Scope < Scope
    def resolve
      scope
        .joins(:authorizations)
        .where(access: 'public')
        .or(scope.where(user: user))
        .or(scope.where(authorizations: { user: user }))
    end
  end
end
