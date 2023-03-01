# frozen_string_literal: true

class User::UsersController < User::ApplicationController
  def index
    render json: User.order(:github_handle)
  end
end
