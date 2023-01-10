# frozen_string_literal: true

class User::FavoritesController < User::ApplicationController
  def create
    if params[:project_id].present?
      project = authorize(Project.find(params[:project_id]), :read?)
      current_user.favorite(project)
    end

    redirect_to user_projects_path, notice: 'Project added to favorites.'
  end

  def destroy
    project = Project.find(params[:project_id])
    current_user.unfavorite(project)
    redirect_to user_projects_path, notice: 'Removed from favorites.'
  end
end
