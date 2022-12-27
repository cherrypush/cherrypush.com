# frozen_string_literal: true

module OccurrencesHelper
  def metric_dropdown_entries(project, owners)
    project.metrics.map do |metric|
      {
        title: metric.name,
        url: user_metrics_path(project_id: project.id, metric_name: metric.name, owner_handles: owners&.map(&:handle)),
      }
    end
  end

  def owner_dropdown_entries(project, metric)
    project.owners.map do |owner|
      {
        title: owner.handle,
        url: user_metrics_path(project_id: project.id, metric_name: metric&.name, owner_handles: [owner.handle]),
      }
    end
  end

  def project_dropdown_entries
    if current_user
      current_user.projects.map { |project| { title: project.name, url: user_metrics_path(project_id: project.id) } }
    else
      Project.public_access.map { |project| { title: project.name, url: project_path(project) } }
    end
  end
end
