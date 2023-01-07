# frozen_string_literal: true

class User::MetricsController < User::ApplicationController
  def index # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity
    @project = Project.find_by(id: params[:project_id]) || current_user.reports.last&.project
    return redirect_to user_projects_path, notice: 'You first need to create a project.' if @project.nil?
    return redirect_to projects_path, notice: 'You are not authorized to view this project.' unless authorized?

    @metric = Metric.new(name: params[:metric_name], project: @project) if params[:metric_name]

    if params[:owner_handles].present?
      @selected_owners = []
      params[:owner_handles].each { |handle| @selected_owners << Owner.new(handle:) }
    end
  end

  private

  # TODO: Shall we move this to a policy object?
  def authorized? # rubocop:disable Metrics/CyclomaticComplexity
    return true if @project.nil?
    @project.public_access? || current_user&.projects&.include?(@project) ||
      current_user&.authorizations&.find_by(project: @project)
  end
end
