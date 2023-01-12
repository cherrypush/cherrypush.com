# frozen_string_literal: true

class User::AuthorizationsController < User::ApplicationController
  before_action :set_project, only: :create
  before_action :set_user, only: :create
  before_action :require_premium_status, except: %i[index]

  def index
    @authorizations = Authorization.where(project: current_user.projects)
  end

  def new
    @authorization = Authorization.new
  end

  def create
    authorization = Authorization.find_or_initialize_by(project: @project, user: @user)
    if authorization.save
      if Rails.env.production?
        TelegramClient.send(
          "#{current_user.github_handle} added #{authorization.user.github_handle} to #{authorization.project.name}.",
        )
      end
      redirect_to user_authorizations_path, notice: 'Authorization created.'
    else
      redirect_to user_authorizations_path, alert: authorization.errors.full_messages.to_sentence
    end
  end

  def destroy
    authorization = Authorization.find_by(id: params[:id])
    # TODO: use a policy here
    unless authorization.project.in?(current_user.owned_projects)
      return redirect_to user_authorizations_path, alert: 'You are not authorized to do this.'
    end
    authorization.destroy!
    redirect_to user_authorizations_path, notice: 'Authorization removed.'
  end

  private

  def set_project
    @project = current_user.owned_projects.find(params[:project_id])
  end

  def set_user
    @user = User.find(params[:user_id])
  end
end
