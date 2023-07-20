# frozen_string_literal: true

class User::UsersController < User::ApplicationController
  def index
    users = params[:ids] ? User.where(id: params[:ids]) : User.all

    render json: users.order(:github_handle)
  end

  def show
    render json: User.find(params[:id])
  end
end
