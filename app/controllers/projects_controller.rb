# frozen_string_literal: true

class ProjectsController < ApplicationController
  def index
    @projects = Project.public_access.joins(:reports).distinct
  end

  def show
    @project = Project.find(params[:id])
    return redirect_to projects_path, notice: 'You are not authorized to view this project' unless authorized?

    @metric = Metric.new(name: params[:metric_name], project: @project) if params[:metric_name]
    @owner = Owner.new(handle: params[:owner_handle]) if params[:owner_handle]
  end

  private

  # TODO: Shall we move this to a policy object?
  def authorized?
    @project.public_access? || current_user&.projects&.include?(@project) ||
      current_user&.authorizations&.find_by(project: @project)
  end
end
