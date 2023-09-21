# frozen_string_literal: true

class User::AuthorizationsController < User::ApplicationController
  before_action :set_organization, only: :create
  before_action :set_user, only: :create

  def index
    render json: Authorization.where(organization: current_user.organizations).includes(:user).as_json(include: :user)
  end

  def create
    can_create_authorization, error_message = @organization.can_create_new_authorizations?

    if can_create_authorization
      authorization = Authorization.find_or_create_by!(organization: @organization, user: @user)
      AuthorizationRequest.where(organization: @organization, user: @user).destroy_all
      UserMailer.with(from: current_user, to: @user, organization: @organization).authorization_granted.deliver_later
      TelegramClient.send("#{current_user.name} added #{authorization.user.name} to #{@organization.name}.")
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

  def set_organization
    @organization = current_user.organizations.find(params[:organization_id])
  end

  def set_user
    @user = User.find(params[:user_id])
  end
end
