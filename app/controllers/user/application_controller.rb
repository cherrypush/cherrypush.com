# frozen_string_literal: true

class User::ApplicationController < ApplicationController
  before_action :authenticate_user!

  private

  def require_premium_status
    redirect_to(pricing_path, alert: 'This action requires a premium plan.') unless current_user.premium?
  end

  def authenticate_user!
    alert = 'You must be logged in to access this page'
    redirect_to(root_path, alert:) if current_user.nil?
  end
end
