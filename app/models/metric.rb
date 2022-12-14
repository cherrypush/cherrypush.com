# frozen_string_literal: true

class Metric
  attr_reader :name

  def initialize(name:, project:)
    @name = name
    @project = project
  end

  def chart_data(owner: nil)
    chart_occurrences = Occurrence.where(report: @project.daily_reports)
    chart_occurrences = chart_occurrences.where(metric_name: name)
    chart_occurrences = chart_occurrences.where('? = ANY (owners)', owner.handle) if owner.present?
    chart_occurrences.joins(:report).group_by_day('reports.commit_date').count.reject { |_k, v| v.zero? }
  end

  def occurrences(owner: nil)
    occurrences = @project.reports.last.occurrences
    occurrences = occurrences.where(metric_name: name)
    occurrences = occurrences.where('? = ANY (owners)', owner.handle) if owner.present?
    occurrences
  end
end
