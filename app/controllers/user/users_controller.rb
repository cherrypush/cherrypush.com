# frozen_string_literal: true

class User::UsersController < User::ApplicationController
  def index
    users = params[:ids] ? User.where(id: params[:ids]) : User.all

    render json: users.order(:github_handle)
  end

  # TODO: split this endpoint into two, one for user#show and another for current_user#show (used by useCurrentUser)
  def show
    return render json: current_user.to_json(only: User::ALL_ATTRIBUTES) if current_user.id == params[:id].to_i

    render json: User.find(params[:id])
  end
end
