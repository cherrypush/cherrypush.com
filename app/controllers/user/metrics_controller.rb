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
