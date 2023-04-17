# frozen_string_literal: true

class User::Metrics::OccurrencesController < User::ApplicationController
  def index
    metric = Metric.includes(:project, :reports).find(params[:metric_id])
    authorize metric.project, :read?
    render json: metric.occurrences(params[:owners])
  end
end
