# frozen_string_literal: true

class ProjectsController < ApplicationController
  def index
    @projects = Project.public_access.joins(:reports).distinct
  end

  def show
    @project = Project.find(params[:id])
    return redirect_to projects_path, notice: 'You are not authorized to view this project' unless authorized?

    @metric = Metric.new(name: params[:metric_name], project: @project) if params[:metric_name]

    if params[:owner_handles].present?
      @selected_owners = []
      params[:owner_handles].each { |handle| @selected_owners << Owner.new(handle:) }
    end
  end

  private

  # TODO: Shall we move this to a policy object?
  def authorized?
    @project.public_access? || current_user&.projects&.include?(@project) ||
      current_user&.authorizations&.find_by(project: @project)
  end
end
