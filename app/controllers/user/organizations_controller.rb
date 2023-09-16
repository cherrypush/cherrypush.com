# frozen_string_literal: true

class User::OrganizationsController < User::ApplicationController
  def show
    render json: current_user.owned_organizations.find(params[:id])
  end
end
