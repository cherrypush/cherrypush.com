# frozen_string_literal: true

class User::ProjectsController < ApplicationController
  def index
    @projects = current_user.projects
  end

  def destroy
    current_user.projects.find(params[:id]).destroy
    redirect_to user_projects_path, notice: 'Project removed'
  end

  private

  def project_params
    params.require(:project).permit(:repo_url)
  end
end
