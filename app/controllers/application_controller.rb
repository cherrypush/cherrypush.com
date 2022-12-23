# frozen_string_literal: true

class ApplicationController < ActionController::Base
  helper_method :current_user

  layout -> { current_user ? 'application' : 'landing' }

  private

  def current_user
    @current_user ||=
      begin
        user = User.find_by(id: session[:user_id]) if session[:user_id]
        # reset_session if user.nil? # clear session if the user is not found
        user
      end
  end
end
