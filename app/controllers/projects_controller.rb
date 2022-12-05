# frozen_string_literal: true

class ProjectsController < ApplicationController
  def index
    @projects = Project.joins(:reports).distinct
  end

  def show # rubocop:disable Metrics/AbcSize
    @project = Project.find(params[:id])

    @occurrences = @project.reports.last.occurrences
    @occurrences = @occurrences.where(metric_name: params[:metric_name]) if params[:metric_name].present?

    chart_occurrences = Occurrence.where(report: reports_for_chart)
    chart_occurrences = chart_occurrences.where(metric_name: params[:metric_name]) if params[:metric_name].present?

    @chart_data =
      chart_occurrences
        .map(&:metric_name)
        .uniq
        .map do |metric_name|
          { name: metric_name, data: chart_occurrences.where(metric_name:).group_by_day(:created_at).count }
        end
  end

  private

  def reports_for_chart
    @project.reports.group_by { |report| report.created_at.to_date }.map { |_day, reports| reports.last }
  end
end
