# frozen_string_literal: true

module ApplicationHelper
  def react_component(name, props: {})
    content_tag :div, nil, data: { component: name, props: props.to_json }
  end

  def number_to_diff(number)
    number_with_delimiter(number.negative? ? number.to_s : "+#{number}")
  end

  def title(page_title)
    content_for(:title) { page_title }
  end

  def markdown(text)
    options = %i[
      hard_wrap
      autolink
      no_intra_emphasis
      tables
      fenced_code_blocks
      disable_indented_code_blocks
      strikethrough
      lax_spacing
      space_after_headers
      quote
      footnotes
      highlight
      underline
    ]
    Markdown.new(text, *options).to_html.html_safe
  end

  def cherry_run_cmd(metric_name = nil, owners = nil)
    cmd = ['cherry run']
    cmd.push "--metric='#{metric_name}'" if metric_name.present?
    cmd.push "--owner='#{owners.map(&:handle).join(',')}'" if owners.present?
    cmd.join(' ')
  end

  def navbar_search_items
    current_user.projects.flat_map do |project|
      project.metrics.map do |metric|
        {
          text: html_escape("#{metric.name} - #{project.name}"),
          href: user_metrics_path(project_id: project.id, metric_name: metric.name),
        }
      end
    end
  end

  def github_commit_url(project_name, commit_sha)
    "https://github.com/#{project_name}/commit/#{commit_sha}"
  end

  def commit_author_name(git_name, git_email)
    match = git_email.match(/(.*)@users.noreply.github.com$/)
    return git_name if match.nil?
    match[1].split('+').last
  end
end
