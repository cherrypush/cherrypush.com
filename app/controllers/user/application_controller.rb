# frozen_string_literal: true

class User::ApplicationController < ApplicationController
  before_action :authenticate_user!
  before_action :build_search_items

  private

  def authenticate_user!
    alert = 'You must be logged in to access this page'
    redirect_to(projects_path, alert:) if current_user.nil?
  end

  def build_search_items
    @search_items =
      current_user.projects.flat_map do |project|
        project.metrics.map do |metric|
          { text: "#{metric.name} - #{project.name}", href: user_metrics_path(project:, metric_name: metric.name) }
        end
      end
  end
end
