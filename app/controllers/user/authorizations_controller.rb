# frozen_string_literal: true

class User::AuthorizationsController < User::ApplicationController
  before_action :set_organization, only: :create

  def index
    render json: Authorization.where(organization: current_user.organizations).includes(:user).as_json(include: :user)
  end

  def create
    if @organization.can_create_new_authorizations?
      authorization = Authorization.find_or_create_by!(organization: @organization, email: params[:email])
      clear_related_authorization_requests
      send_notifications(authorization)
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

  def send_notifications(authorization)
    notify_admin(authorization) unless current_user == @organization.user
    notify_user(authorization)
    TelegramClient.send("#{current_user.name} added #{params[:email]} to #{@organization.name}.")
  end

  def notify_user(authorization)
    UserMailer.with(granted_by_user: current_user, authorization: authorization).authorization_granted.deliver_later
  end

  def notify_admin(authorization)
    UserMailer.with(granted_by_user: current_user, authorization: authorization).authorization_alert.deliver_later
  end

  def clear_related_authorization_requests
    AuthorizationRequest.where(organization: @organization, user: User.find_by(email: params[:email])).destroy_all
  end

  def error_message
    reason = "A paid plan is required to create authorizations."
    suggestion = "Reach out to the owner of your organization: #{@organization.user.name} <#{@organization.user.email}>"
    "#{reason} #{suggestion}"
  end
end
