# frozen_string_literal: true

class Api::MetricsController < Api::ApplicationController
  include Api::ProjectScoped

  def show
    metric = current_project.metrics.find_by(name: params[:metric_name])

    return head :not_found if metric.nil?
    return head :not_found if metric.reports.empty?

    render json: { value: metric.value }
  end
end
