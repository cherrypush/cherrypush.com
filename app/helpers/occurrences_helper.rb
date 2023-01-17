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

  def owner_dropdown_entries(project, metric) # rubocop:disable Metrics/MethodLength
    entries =
      project
        .owners
        .sort_by { |owner| current_user.favorite_owner_handles.include?(owner.handle) ? 0 : 1 }
        .map do |owner|
          {
            title: owner.handle,
            url:
              user_metrics_path(
                project_id: project.id,
                metric_name: metric&.name,
                owner_handles: (params[:owner_handles] || []) + [owner.handle],
              ),
          }
        end

    entries.unshift(favorites_entry(project, metric))
    entries
  end

  def project_dropdown_entries
    current_user.projects.map { |project| { title: project.name, url: user_metrics_path(project_id: project.id) } }
  end

  def github_handle_autocomplete_items
    User
      .where.not(id: current_user.id)
      .map { |user| { id: user.id, name: user.github_handle } }
      .sort_by { |user| user[:name].downcase }
  end

  def project_autocomplete_items
    current_user.owned_projects.map { |project| { id: project.id, name: project.name } }
  end

  private

  def favorites_entry(project, metric)
    {
      title: (heroicon('star', options: { class: 'mr-1' }) + 'Apply favorites').html_safe,
      url:
        user_metrics_path(
          project_id: project.id,
          metric_name: metric&.name,
          owner_handles:
            current_user.favorite_owner_handles.filter { |handle| project.owners.map(&:handle).include?(handle) },
        ),
    }
  end
end
