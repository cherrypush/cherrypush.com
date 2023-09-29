# frozen_string_literal: true

class User::OwnersController < User::ApplicationController
  def index
    return render json: metric_owners if params[:metric_id]
    return render json: project_owners if params[:project_id]

    render json: current_user.owners
  end

  private

  def metric_owners
    metric = Metric.find(params[:metric_id])
    authorize metric.project, :read_access?
    metric.owners
  end

  def project_owners
    project = authorize Project.find(params[:project_id]), :read_access?
    project.owners
  end
end
