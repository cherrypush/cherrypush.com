# frozen_string_literal: true

class User::ProjectsController < User::ApplicationController
  def index
    @projects = current_user.projects.sort_by { |project| current_user.favorited?(project) ? 0 : 1 }
  end

  def destroy
    @project = authorize(Project.find(params[:id]), :destroy?)
    @project.destroy!
    redirect_to user_projects_path, notice: 'Project was successfully deleted.'
  end
end
