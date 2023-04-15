# frozen_string_literal: true

class Metric < ApplicationRecord
  belongs_to :project, touch: true
  has_many :reports, dependent: :destroy

  validates :name, presence: true

  def last_report
    @last_report ||= reports.order(:date).last
  end

  def occurrences(owner_handles = [])
    return [] if last_report.nil?
    occurrences = last_report.occurrences
    return occurrences if owner_handles.blank?
    occurrences.where('owners && ARRAY[?]::varchar[]', owner_handles)
  end

  def owners
    return [] if last_report.nil? || last_report.value_by_owner.nil?

    last_report.value_by_owner.map { |handle, count| Owner.new(handle: handle, count: count) }.sort_by(&:count).reverse
  end

  def chart_data(owners: nil)
    daily_reports
      .index_with { |report| get_count(report, owners) }
      .compact
      .transform_keys { |report| report.date.iso8601[0...10] }
  end

  private

  def daily_reports
    reports.group_by { |report| report.date.to_date }.map { |_day, reports| reports.max_by(&:date) }.sort_by(&:date)
  end

  def get_count(report, owners)
    owners ? owners.map { |owner| report.value_by_owner[owner] || 0 }.sum : report.value
  end
end
