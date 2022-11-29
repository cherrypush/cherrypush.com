# frozen_string_literal: true

module OccurrencesHelper
  def metric_names_for(project)
    project
      .occurrences
      .map(&:metric_name)
      .uniq
      .sort
      .map { |metric_name| { title: metric_name, url: project_path(project.name, metric_name: metric_name) } }
  end
end
