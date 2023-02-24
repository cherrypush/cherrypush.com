# frozen_string_literal: true

class User::UsersController < User::ApplicationController
  def index
    users =
      User
        .where.not(id: current_user.id)
        .map { |user| { id: user.id, name: user.github_handle } }
        .sort_by { |user| user[:name].downcase }

    render json: users
  end
end
