# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user

  has_many :metrics, dependent: :destroy
  has_many :reports, through: :metrics
  has_many :dashboards, dependent: :destroy
  has_many :authorizations, dependent: :destroy

  validates :name, presence: true
  validates :user, presence: true

  def owners
    metrics.map(&:owners).flatten.uniq.sort_by(&:handle)
  end

  def users
    User.where(id: authorizations.pluck(:user_id) + [user_id].uniq)
  end

  def delete_old_occurrences!
    most_recent_report = reports.order(date: :desc).first
    old_reports = reports.where('date < ?', 1.week.ago).where.not(id: most_recent_report.id)
    Occurrence.where(report: old_reports).delete_all
  end
end
