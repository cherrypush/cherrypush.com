# frozen_string_literal: true

class Metric
  attr_reader :name

  def initialize(name:, project:)
    @name = name
    @project = project
  end

  def owners
    @project.reports.last.metrics[name]['owners'].map { |handle, count| Owner.new(handle:, count:) }
  end

  def chart_data(owner: nil)
    @project
      .daily_reports
      .map { |report| [report.commit_date.to_date, get_count(report, owner)] }
      .reject { |_k, v| v.nil? || v.zero? }
  end

  private

  # TODO: this should come from a method on Metric
  def get_count(report, owner)
    owner ? report.metrics.dig(name, 'owners', owner.handle) : report.metrics.dig(name, 'total')
  end
end
