# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user
  has_many :reports, dependent: :destroy
  has_many :authorizations, dependent: :destroy

  validates :name, presence: true
  validates :user, presence: true

  enum access: { private: 'private', public: 'public' }, _suffix: :access

  def metrics
    reports.last.occurrences.map(&:metric_name).uniq.sort.map { |name| Metric.new(name:, project: self) }
  end

  def owners
    reports.last.occurrences.map(&:owners).flatten.uniq.sort.map { |owner| Owner.new(handle: owner) }
  end

  def daily_reports
    reports.group_by { |report| report.commit_date.to_date }.map { |_day, reports| reports.last }
  end
end
