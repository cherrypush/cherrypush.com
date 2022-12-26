# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user
  has_many :reports, dependent: :destroy
  has_many :authorizations, dependent: :destroy

  validates :name, presence: true
  validates :user, presence: true

  enum access: { private: 'private', public: 'public' }, _suffix: :access

  def latest_report
    reports.order(:commit_date).last
  end

  def metrics
    return [] if reports.empty?
    latest_report.metrics.keys.sort.map { |name| Metric.new(name:, project: self) }
  end

  def owners
    reports
      .last
      .metrics
      .each_with_object([]) do |(_metric_name, metric), owner_handles|
        metric['owners'].each { |handle, _count| owner_handles << handle }
      end
      .uniq
      .sort
      .map { |owner| Owner.new(handle: owner) }
  end

  def daily_reports
    reports.group_by { |report| report.commit_date.to_date }.map { |_day, reports| reports.last }
  end
end
