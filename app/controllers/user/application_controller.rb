# frozen_string_literal: true

class User::ApplicationController < ApplicationController
  before_action :authenticate_user!
  # TODO: enable CSRF check, it's disabled as XHR requests do not include it
  skip_before_action :verify_authenticity_token

  rescue_from Pundit::NotAuthorizedError do
    if request.format.json?
      render json: { error: 'You are not authorized to perform this action.' }, status: :forbidden
    else
      redirect_to(request.referer, alert: 'You are not authorized to perform this action.')
    end
  end

  def spa
  end

  private

  def require_premium_status
    redirect_to(pricing_path, alert: 'This action requires a premium plan.') unless current_user.premium?
  end

  def authenticate_user!
    alert = 'You must be logged in to access this page'
    redirect_to(root_path, alert:) if current_user.nil?
  end
end
