# frozen_string_literal: true

class User::OwnersController < User::ApplicationController
  def index
    if params[:metric_id]
      metric = Metric.find(params[:metric_id])
      authorize metric.project, :read?
      render json: metric.owners
    elsif params[:project_id]
      project = authorize Project.find(params[:project_id]), :read?
      render json: project.owners
    else
      render json: current_user.owners
    end
  end
end
