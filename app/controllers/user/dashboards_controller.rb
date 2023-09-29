# frozen_string_literal: true

class User::DashboardsController < User::ApplicationController
  def index
    render json:
             Dashboard
               .includes(:charts, :project)
               .where(project: current_user.projects)
               .order(:name)
               .as_json(include: [:charts, { project: { only: :name } }])
  end

  def show
    dashboard = Dashboard.find(params[:id])

    if ProjectPolicy.new(current_user, dashboard.project).read_access?
      render json: dashboard.as_json(include: [:project, { charts: { include: :chart_metrics } }])
    else
      render json: { redirect_url: user_projects_path(project_id: dashboard.project.id) }, status: :unauthorized
    end
  end

  def create
    project = authorize Project.find(params[:dashboard][:project_id]), :write_access?
    render json: project.dashboards.create!(dashboard_params)
  end

  def update
    dashboard = Dashboard.find(params[:id])
    authorize dashboard.project, :write_access?
    dashboard.update!(dashboard_params)
  end

  def destroy
    dashboard = Dashboard.find(params[:id])
    authorize dashboard.project, :write_access?
    dashboard.destroy!
  end

  private

  def dashboard_params
    params.require(:dashboard).permit(:name)
  end
end
