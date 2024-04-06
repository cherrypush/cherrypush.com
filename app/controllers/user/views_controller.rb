# frozen_string_literal: true

class User::ViewsController < User::ApplicationController
  def index
    metric = Metric.find(params[:metric_id])
    render json: metric.views
  end

  def create
    metric = current_user.metrics.find(params[:metric_id])
    current_user.views.create!(viewable: metric)
    head :created
  end
end
