# frozen_string_literal: true

class User::ContributionsController < User::ApplicationController
  def index
    metric = Metric.find(params[:metric_id])
    authorize metric.project, :read?
    render json: metric.contributions
  end
end
