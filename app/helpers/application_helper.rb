# frozen_string_literal: true

module ApplicationHelper
  def react_component(name, props = {})
    content_tag :div, nil, data: { component: name, props: props.to_json }
  end

  def number_to_diff(number)
    return if number.zero?
    caret = number.negative? ? '▾' : '▴'
    caret = "<span class='text-xl'>#{caret}</span>".html_safe
    color = number.negative? ? 'text-green-300' : 'text-red-300'
    "<span class='#{color}'>#{caret} #{number.abs}</span>".html_safe
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
      project.deprecated_metrics.map do |metric|
        {
          name: html_escape("#{project.name} - #{metric.name}"),
          href: user_metrics_url(project_id: project.id, metric_name: metric.name),
          selected: metric.name == @metric&.name && project.id == @project&.id,
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
