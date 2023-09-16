# frozen_string_literal: true

class User::ProjectsController < User::ApplicationController
  def index
    projects = current_user.projects.includes(:user)
    render json:
             projects
               .includes(:user, organization: :user)
               .order(:name)
               .as_json(
                 include: {
                   user: {
                     only: %i[name github_handle],
                   },
                   organization: {
                     only: %i[id name],
                     include: {
                       user: {
                         only: %i[name github_handle],
                       },
                     },
                   },
                 },
               )
  end

  def destroy
    project = authorize(Project.find(params[:id]), :destroy?)
    project.destroy!
    redirect_to user_projects_path, notice: "Project was successfully deleted."
  end
end
