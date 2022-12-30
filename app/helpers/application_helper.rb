# frozen_string_literal: true

module ApplicationHelper
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
    cmd.push "--metric=#{metric_name}" if metric_name.present?
    cmd.push "--owner=#{owners.map(&:handle).join(',')}" if owners.present?
    cmd.join(' ')
  end

  def cherry_backfill_cmd(api_key)
    "cherry backfill --since=#{1.year.ago.strftime('%Y-%m-%d')} --interval=30 --api-key=#{api_key}"
  end

  def navbar_search_items
    current_user.projects.flat_map do |project|
      project.metrics.map do |metric|
        {
          text: html_escape("#{metric.name} - #{project.name}"),
          href: user_metrics_path(project:, metric_name: metric.name),
        }
      end
    end
  end
end
