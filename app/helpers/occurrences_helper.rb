# frozen_string_literal: true

module OccurrencesHelper
  def metric_dropdown_entries(project, owners)
    project.metrics.map do |metric|
      { title: metric.name, url: project_path(project, metric_name: metric.name, owner_handles: owners&.map(&:handle)) }
    end
  end

  def owner_dropdown_entries(project, metric)
    project.owners.map do |owner|
      { title: owner.handle, url: project_path(project, metric_name: metric&.name, owner_handles: [owner.handle]) }
    end
  end
end
