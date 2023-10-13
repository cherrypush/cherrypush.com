# frozen_string_literal: true

class User::OrganizationsController < User::ApplicationController
  def show
    organization = authorize Organization.find(params[:id]), :read_access?
    render json: organization
  end

  def update
    organization = authorize Organization.find(params[:id]), :admin?
    organization.update!(organization_params)
  end

  private

  def organization_params
    params.require(:organization).permit(:sso_domain, :sso_enabled)
  end
end
