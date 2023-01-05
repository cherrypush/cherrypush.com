# frozen_string_literal: true

class User::AuthorizationsController < User::ApplicationController
  before_action :set_project, only: :create
  before_action :set_user, only: :create
  before_action :require_premium_status, except: %i[index]

  def index
    @authorizations = Authorization.where(project: current_user.projects)
  end

  def new
    @projects = current_user.owned_projects.private_access
    @github_handles = User.where.not(id: current_user.id).map(&:github_handle).compact
    @authorization = Authorization.new
  end

  def create
    return redirect_to user_authorizations_path, alert: 'User not found.' if @user.blank?
    return redirect_to user_authorizations_path, alert: 'Project not found.' if @project.blank?

    authorization = Authorization.find_or_initialize_by(project: @project, user: @user)
    if authorization.save
      if Rails.env.production?
        TelegramClient.send(
          "#{current_user.github_handle} added #{authorization.user.github_handle} to #{authorization.project.name}.",
        )
      end
      redirect_to user_authorizations_path, notice: 'Authorization created.'
    else
      render :new
    end
  end

  def destroy
    authorization = Authorization.find_by(id: params[:id], project_id: current_user.projects.ids)
    authorization.destroy!
    redirect_to user_authorizations_path, notice: 'Authorization removed.'
  end

  private

  def set_project
    @project = current_user.owned_projects.find(params[:project_id])
  end

  def set_user
    @user = User.find_by(github_handle: params[:github_handle])
  end
end
