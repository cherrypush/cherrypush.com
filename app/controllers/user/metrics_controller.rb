# frozen_string_literal: true

class User::MetricsController < User::ApplicationController
  before_action :set_project, if: -> { params[:project_id].present? }
  before_action :set_metric, if: -> { params[:metric_id].present? }

  def index
    if @project
      authorize(@project, :read?)
      metrics = @project.metrics.order('LOWER(name)').as_json(include: %i[project last_report])
    else
      metrics = current_user.metrics.as_json(include: %i[project last_report])
    end

    render json: metrics
  end

  def show
    metric = Metric.includes(:project, :reports).find(params[:id])
    authorize metric.project, :read?
    attributes = { owners: metric.owners, chart_data: metric.chart_data(owners: params[:owner_handles]) }
    render json: metric.attributes.merge(attributes)
  end

  def destroy
    metric = Metric.find(params[:id])
    authorize(metric.project, :destroy?)
    metric.destroy!
    render json: { message: 'Metric deleted' }
  end

  private

  def set_metric
    @metric = Metric.find_by(id: params[:metric_id])
  end

  def set_project
    @project = Project.includes(:metrics).find_by(id: params[:project_id])
  end
end
