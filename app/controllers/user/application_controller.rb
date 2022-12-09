# frozen_string_literal: true

class User::ApplicationController < ApplicationController
  before_action :authenticate_user!

  private

  def authenticate_user!
    # TODO: the line below is not showing the flash message
    redirect_to root_path, alert: 'You must be logged in to access this page' unless current_user
  end
end
