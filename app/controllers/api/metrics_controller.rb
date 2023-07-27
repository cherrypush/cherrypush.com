# frozen_string_literal: true

class Api::MetricsController < Api::ApplicationController
  include Api::ProjectScoped

  def index
    project = @user.projects.find_by(name: params[:project_name])
    return head :not_found if project.nil?

    metric = project.metrics.find_by(name: params[:metric_name])
    return head :not_found if metric.nil?

    render json: metric_data(metric)
  end

  private

  def metric_data(metric)
    Rails.cache.fetch([@user, metric]) { { value: metric.value, occurrences: metric.occurrences.pluck(:text) } }
  end
end
