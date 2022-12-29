# frozen_string_literal: true

class User::AuthorizationsController < User::ApplicationController
  before_action :set_project, only: :create
  before_action :set_user, only: :create

  def index
    @authorizations = Authorization.where(project: current_user.projects)
  end

  def new
    return redirect_to user_projects_path, alert: 'You need to create a project first.' if current_user.projects.blank?
    if current_user.projects.private_access.blank?
      return redirect_to user_projects_path, alert: 'None of your projects are private.'
    end

    @projects = current_user.projects.private_access
    @github_handles = User.where.not(id: current_user.id).map(&:github_handle).compact
    @authorization = Authorization.new
  end

  def create
    return redirect_to user_authorizations_path, alert: 'User not found.' if @user.blank?
    return redirect_to user_authorizations_path, alert: 'Project not found.' if @project.blank?

    authorization = Authorization.new(project: @project, user: @user)
    if authorization.save
      redirect_to user_authorizations_path, notice: 'Authorization created.'
    else
      render :new
    end
  end

  def destroy
    current_user.authorizations.find(params[:id]).destroy!
    redirect_to user_authorizations_path, notice: 'Authorization removed.'
  end

  private

  def set_project
    @project = current_user.projects.find(params[:project_id])
  end

  def set_user
    @user = User.find_by(github_handle: params[:github_handle])
  end
end
