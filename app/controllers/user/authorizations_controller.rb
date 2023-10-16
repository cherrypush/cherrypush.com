# frozen_string_literal: true

class User::AuthorizationsController < User::ApplicationController
  before_action :set_organization, only: :create

  def index
    render json: Authorization.where(organization: current_user.organizations).includes(:user).as_json(include: :user)
  end

  def create
    can_create_authorization, error_message = @organization.can_create_new_authorizations?

    if can_create_authorization
      Authorization.find_or_create_by!(organization: @organization, email: params[:email])
      AuthorizationRequest.where(organization: @organization, user: User.find_by(email: params[:email])).destroy_all
      UserMailer
        .with(from: current_user, to: params[:email], organization: @organization)
        .authorization_granted
        .deliver_later
      TelegramClient.send("#{current_user.name} added #{params[:email]} to #{@organization.name}.")
    else
      render json: { error: error_message }, status: :forbidden
    end
  end

  def destroy
    authorization = authorize Authorization.find(params[:id]), :destroy?
    authorization.destroy!
  end

  private

  def set_organization
    @organization = current_user.organizations.find(params[:organization_id])
  end
end
