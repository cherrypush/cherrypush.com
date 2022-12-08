# frozen_string_literal: true

class User::ProjectsController < ApplicationController
  def index
    @projects = current_user.projects.joins(:reports).distinct
  end

  def update
    project = current_user.projects.find(params[:id])
    project.update!(project_params)
    redirect_to user_projects_path, notice: 'Project was successfully updated.'
  end

  def destroy
    @project = current_user.projects.find(params[:id])
    @project.destroy
    redirect_to user_projects_path, notice: 'Project was successfully destroyed.'
  end

  private

  def project_params
    params.require(:project).permit(:name, :access)
  end
end
