# frozen_string_literal: true

class User::MetricsController < User::ApplicationController
  before_action :set_project, if: -> { params[:project_id].present? }
  before_action :set_metric, if: -> { params[:metric_id].present? }
  before_action :set_owners, if: -> { params[:owner_handles].present? }

  def index
    if params[:project_id].blank?
      fallback_project = current_user.projects.first
      return redirect_to user_metrics_path(project_id: fallback_project.id) if fallback_project
      return redirect_to user_projects_path, alert: 'You need to create a project first.'
    end

    return redirect_to user_projects_path, alert: 'Project not found.' if @project.nil?

    authorize @project, :read?

    if @metric
      @occurrences = @metric.reports.last.occurrences
      if @selected_owners
        @occurrences = @occurrences.where('owners && ARRAY[?]::varchar[]', @selected_owners&.map(&:handle))
      end
    end

    @metrics = @project.metrics.includes(:reports)
  end

  def show
    @metric = Metric.find(params[:id])
    authorize @metric.project, :read?
    render json: @metric.attributes.merge(chart_data: @metric.chart_data)
  end

  def destroy
    metric = Metric.find(params[:id])
    project = metric.project
    authorize(project, :destroy?)
    metric.destroy!
    redirect_to user_metrics_path(project_id: project.id), notice: 'Metric was successfully deleted.'
  end

  private

  def set_owners
    @selected_owners = []
    params[:owner_handles].each { |handle| @selected_owners << Owner.new(handle:) }
  end

  def set_metric
    @metric = Metric.find_by(id: params[:metric_id])
  end

  def set_project
    @project = Project.find_by(id: params[:project_id])
  end
end
