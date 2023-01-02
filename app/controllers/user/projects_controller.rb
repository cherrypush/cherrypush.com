# frozen_string_literal: true

class User::ProjectsController < User::ApplicationController
  def index
    @projects = current_user.projects.includes(:reports).order('reports.created_at desc nulls last')
  end

  def destroy
    @project = current_user.projects.find(params[:id])
    @project.destroy
    redirect_to user_projects_path, notice: 'Project was successfully destroyed.'
  end

  def privatize
    @project = current_user.projects.find(params[:id])
    unless current_user.premium?
      return redirect_to user_projects_path, alert: 'A paid plan is required to make projects private.'
    end

    @project.update!(access: 'private')
    redirect_to user_projects_path, notice: 'Project was successfully made private.'
  end

  def publicize
    @project = current_user.projects.find(params[:id])
    @project.update!(access: 'public')
    redirect_to user_projects_path, notice: 'Project was successfully made public.'
  end
end
