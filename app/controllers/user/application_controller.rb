# frozen_string_literal: true

class User::ApplicationController < ApplicationController
  before_action :authenticate_user!

  layout 'application'

  rescue_from(Pundit::NotAuthorizedError) { redirect_with_error('You are not authorized to perform this action.') }

  def spa; end

  private

  def authenticate_user!
    return if current_user

    redirect_with_error('You must be logged in to perform this action.')
  end

  def redirect_with_error(message)
    if request.format.json?
      render json: { error: message }, status: :forbidden
    else
      redirect_back(fallback_location: root_path, alert: message)
    end
  end
end
