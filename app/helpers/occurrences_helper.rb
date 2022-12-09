# frozen_string_literal: true

module OccurrencesHelper
  def dropdown_entries_for_metrics(project, current_team)
    project
      .reports
      .last
      .occurrences
      .map(&:metric_name)
      .uniq
      .sort
      .map { |metric_name| { title: metric_name, url: project_path(project, metric_name:, team_name: current_team) } }
  end

  def dropdown_entries_for_teams(project, current_metric)
    project
      .reports
      .last
      .occurrences
      .map(&:owners)
      .flatten
      .uniq
      .sort
      .map { |team_name| { title: team_name, url: project_path(project, metric_name: current_metric, team_name:) } }
  end
end
