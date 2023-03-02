# frozen_string_literal: true

class User::OwnersController < User::ApplicationController
  def index
    render json: current_user.owners
  end
end
