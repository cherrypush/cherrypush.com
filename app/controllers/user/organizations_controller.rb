# frozen_string_literal: true

class User::OrganizationsController < User::ApplicationController
  def index
    render json:
             current_user
               .organizations
               .order(:name)
               .map { |organization| organization.attributes.merge(sso_user_count: organization.sso_users.count) }
  end

  def show
    organization = authorize Organization.find(params[:id]), :read_access?

    render json:
             organization.attributes.merge(
               subscriptions: organization.subscriptions,
               sso_user_count: organization.sso_users.count,
               user: organization.user.slice(:id, :name, :email),
               stripe_customer_portal_url: organization.stripe_customer_portal_url
             )
  end

  def update
    organization = authorize Organization.find(params[:id]), :admin?
    return head :no_content if organization.update(organization_params)

    render json: { error: organization.errors.full_messages }, status: :unprocessable_entity
  end

  private

  def organization_params
    params.require(:organization).permit(:sso_domain, :sso_enabled)
  end
end
