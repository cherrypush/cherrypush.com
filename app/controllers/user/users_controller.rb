# frozen_string_literal: true

class User::UsersController < User::ApplicationController
  def index
    users = current_user.organizations.map(&:users).flatten.uniq
    users = users.filter { |user| user.id.in?(params[:ids]) } if params[:ids].present?
    render json: users.sort_by(&:name)
  end

  # TODO: split this endpoint into two, one for user#show and another for current_user#show (used by useCurrentUser)
  def show
    return render json: current_user.to_json(only: User::ALL_ATTRIBUTES) if current_user.id == params[:id].to_i

    render json: User.find(params[:id])
  end
end
