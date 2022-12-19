# frozen_string_literal: true

class Metric
  attr_reader :name

  def initialize(name:, project:)
    @name = name
    @project = project
  end

  def owners
    @project
      .owners
      .each { |owner| owner.count = get_count(@project.reports.last, [owner]) || 0 }
      .sort_by(&:count)
      .reverse
  end

  def chart_data(owners: nil)
    @project.daily_reports.map { |report| [report.commit_date.to_date, get_count(report, owners)] }.compact
  end

  private

  # TODO: this should come from a method on Metric
  def get_count(report, owners)
    if owners
      owners.map { |owner| report.metrics.dig(name, 'owners', owner.handle) || 0 }.sum
    else
      report.metrics.dig(name, 'total')
    end
  end
end
