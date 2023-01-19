# frozen_string_literal: true

module OccurrencesHelper
  def recent_commits(project, metric)
    metric.contributions.map do |contribution, value|
      {
        author_name: commit_author_name(contribution.author_name, contribution.author_email),
        commit_sha: contribution.commit_sha,
        time_ago_in_words: time_ago_in_words(contribution.commit_date) + ' ago',
        changes: value,
        url: github_commit_url(project.name, contribution.commit_sha),
      }
    end
  end

  def top_contributors(metric)
    metric.contribution_by_author.map do |(author_name, author_email), value|
      { name: commit_author_name(author_name, author_email), changes: value[:addition] + value[:deletion] }
    end
  end

  def metric_dropdown_entries(project, owners)
    entries =
      project.metrics.map do |metric|
        {
          title: metric.name,
          url:
            user_metrics_path(project_id: project.id, metric_name: metric.name, owner_handles: owners&.map(&:handle)),
        }
      end

    entries.unshift(remove_metric_entry(project)) if params[:metric_name]
    entries
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

    entries.unshift(apply_all_favorite_owners_entry(project, metric))
    entries.unshift(remove_all_owners_entry(project, metric)) if params[:owner_handles]
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

  def apply_all_favorite_owners_entry(project, metric)
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

  def remove_all_owners_entry(project, metric)
    {
      title: (heroicon('x-mark', options: { class: 'mr-1' }) + 'Remove all').html_safe,
      url: user_metrics_path(project_id: project.id, metric_name: metric&.name, owner_handles: nil),
    }
  end

  def remove_metric_entry(project)
    {
      title: (heroicon('x-mark', options: { class: 'mr-1' }) + 'Remove metric').html_safe,
      url: user_metrics_path(project_id: project.id, metric_name: nil, owner_handles: params[:owner_handles]),
    }
  end
end
