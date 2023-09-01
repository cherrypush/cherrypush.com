# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user
  belongs_to :organization, optional: true

  has_many :metrics, dependent: :destroy
  has_many :reports, through: :metrics
  has_many :dashboards, dependent: :destroy
  has_many :authorizations, dependent: :destroy

  validates :name, presence: true
  validates :user, presence: true

  def owners
    # TODO: this is not necessarily the best way to get the owners, but it works for now
    Report.where(metric: metrics).order(date: :desc).limit(100).map(&:owners).flatten.uniq.sort_by(&:handle)
  end

  def users
    User.where(id: authorizations.pluck(:user_id) + [user_id].uniq)
  end

  def can_create_new_authorizations?
    return false, "Your project must be within an organization." if organization.nil?
    return false, "A membership is required to create authorizations." if organization.memberships.empty?
    return false, "Upgrade membership to add authorizations." if organization.team_plan? && authorizations.count >= 10

    true
  end
end
