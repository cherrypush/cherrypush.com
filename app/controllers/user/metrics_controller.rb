# frozen_string_literal: true

class User::MetricsController < User::ApplicationController
  def index
    if params[:project_id]
      project = Project.includes(:metrics).find_by(id: params[:project_id])
      authorize(project, :read?)
      metrics = project.metrics.order("LOWER(name)").as_json(include: %i[project])
    else
      metrics = current_user.metrics.includes(:project).as_json(include: %i[project])
    end

    render json: metrics
  end

  def show
    metric = Metric.includes(:project).find(params[:id])
    authorize metric.project, :read?
    additional_attributes = { chart_data: metric.chart_data(owners: params[:owner_handles]) }
    render json: metric.as_json(only: %i[name project_id id]).merge(additional_attributes)
  end

  def destroy
    metric = Metric.find(params[:id])
    authorize(metric.project, :read?)
    metric.destroy!
    render json: { message: "Metric deleted" }
  end
end
