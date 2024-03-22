# frozen_string_literal: true

class OrganizationPolicy < ApplicationPolicy
  def read_access? # rubocop:disable Metrics/AbcSize
    return true if user.admin?
    return true if record.name == 'cherrypush' # This is the demo organization, so everyone can access it
    return true if record.user == user
    return true if user.authorizations.where(organization: record).any?
    return true if record.sso_enabled? && user.email.end_with?(record.sso_domain)

    false
  end

  def write_access? # rubocop:disable Metrics/AbcSize
    return true if user.admin?
    return true if record.user == user
    return true if user.authorizations.where(organization: record).any?
    return true if record.sso_enabled? && user.email.end_with?(record.sso_domain)

    false
  end

  def admin?
    return true if user.admin?
    return true if record.user == user

    false
  end

  def destroy?
    return true if user.admin?

    record.user == user
  end
end
