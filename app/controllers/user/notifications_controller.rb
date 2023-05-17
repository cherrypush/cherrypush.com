# frozen_string_literal: true

class User::NotificationsController < User::ApplicationController
  def index
    render json: current_user.notifications.includes(:item).order(created_at: :desc).as_json(include: %i[item])
  end
end
