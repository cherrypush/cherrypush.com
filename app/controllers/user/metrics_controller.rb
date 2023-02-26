# frozen_string_literal: true

class User::MetricsController < User::ApplicationController
  before_action :set_project, if: -> { params[:project_id].present? }
  before_action :set_metric, if: -> { params[:metric_id].present? }

  def index
    authorize(@project, :read?) if @project

    respond_to do |format|
      format.html do
        if params[:project_id].blank?
          fallback_project = current_user.projects.first
          return redirect_to user_metrics_path(project_id: fallback_project.id) if fallback_project
          return redirect_to user_projects_path, alert: 'You need to create a project first.'
        end
        redirect_to user_projects_path, alert: 'Project not found.' if @project.nil?
      end
      format.json { render json: @project ? @project.metrics.as_json(include: :last_report) : current_user.metrics }
    end
  end

  def show
    @metric = Metric.find(params[:id])
    authorize @metric.project, :read?
    render json:
             @metric.attributes.merge(
               owners: @metric.owners,
               occurrences: @metric.occurrences(params[:owner_handles]),
               chart_data: @metric.chart_data(owners: params[:owner_handles]),
             )
  end

  def destroy
    metric = Metric.find(params[:id])
    project = metric.project
    authorize(project, :destroy?)
    metric.destroy!
    redirect_to user_metrics_path(project_id: project.id), notice: 'Metric was successfully deleted.'
  end

  private

  def set_metric
    @metric = Metric.find_by(id: params[:metric_id])
  end

  def set_project
    @project = Project.find_by(id: params[:project_id])
  end
end
