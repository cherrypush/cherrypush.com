# frozen_string_literal: true

class User::AuthorizationsController < User::ApplicationController
  before_action :set_project, only: :create
  before_action :set_user, only: :create
  before_action :require_premium_status, except: %i[index]

  def index
    json =
      Authorization
        .where(project: current_user.projects)
        .includes(:user)
        .as_json(include: { user: { only: %i[name github_handle] } })

    render json: json
  end

  def create
    can_create_authorization, error_message = @project.can_create_new_authorizations?

    if can_create_authorization
      authorization = Authorization.find_or_create_by!(project: @project, user: @user)
      AuthorizationRequest.where(project: @project, user: @user).destroy_all
      UserMailer.with(from: current_user, to: @user, project: @project).authorization_granted.deliver_later
      TelegramClient.send("#{current_user.name} added #{authorization.user.name} to #{authorization.project.name}.")
    else
      render json: { error: error_message }, status: :forbidden
    end
  end

  def destroy
    authorization = Authorization.find(params[:id])
    authorize authorization.project, :destroy?
    authorization.destroy!
  end

  private

  def set_project
    @project = authorize Project.find(params[:project_id]), :read?
  end

  def set_user
    @user = User.find(params[:user_id])
  end
end
