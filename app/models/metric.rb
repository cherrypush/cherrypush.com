# frozen_string_literal: true

class Metric < ApplicationRecord
  belongs_to :project, touch: true
  has_many :reports, dependent: :destroy
  has_many :contributions, dependent: :destroy
  has_many :chart_metrics, dependent: :destroy
  has_many :views, as: :viewable, dependent: :destroy

  validates :name, presence: true

  def value
    last_report&.value
  end

  def last_report
    # if two reports have the same date, we want the most recent one
    @_last_report ||= reports.order(:date, :created_at).last
  end

  def occurrences(owners = [])
    return [] if reports.empty?

    occurrences = last_report.occurrences
    return occurrences if owners.blank?

    occurrences.where('owners && ARRAY[?]::varchar[]', owners)
  end

  def owners
    return [] if last_report.nil? || last_report.value_by_owner.nil?

    last_report.value_by_owner.map { |handle, count| Owner.new(handle: handle, count: count) }.sort_by(&:count).reverse
  end

  def chart_data(owners: nil)
    Rails
      .cache
      .fetch([self, 'chart_data', owners], expires_in: 12.hours) do
        daily_reports
          .index_with { |report| get_count(report, owners) }
          .compact
          .transform_keys { |report| report.date.iso8601[0...10] }
      end
  end

  def clean_up!
    old_reports = reports.where.not(id: last_report.id).where('date < ?', 10.minutes.ago)
    Occurrence.where(report: old_reports).in_batches(&:delete_all)
    old_reports.where.not(id: daily_reports.pluck(:id)).in_batches.delete_all
  end

  private

  def daily_reports
    reports.group_by { |report| report.date.to_date }.map { |_day, reports| reports.max_by(&:date) }.sort_by(&:date)
  end

  def get_count(report, owners)
    owners ? owners.map { |owner| report.value_by_owner[owner] || 0 }.sum : report.value
  end
end
