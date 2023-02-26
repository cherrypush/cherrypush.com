# frozen_string_literal: true

class Metric < ApplicationRecord
  belongs_to :project
  has_many :reports, dependent: :destroy

  validates :name, presence: true

  def last_report
    reports.includes(:occurrences).order(:date).last
  end

  def occurrences(owner_handles = [])
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
      .filter_map do |report|
        count = get_count(report, owners)
        count && [report.date.to_date, get_count(report, owners)]
      end
      .sort_by { |date, _count| date }
  end

  private

  def daily_reports
    reports.group_by { |report| report.date.to_date }.map { |_day, reports| reports.last }
  end

  def get_count(report, owners)
    owners ? owners.map { |owner| report.value_by_owner[owner] || 0 }.sum : report.value
  end
end
