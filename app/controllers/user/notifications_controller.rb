# frozen_string_literal: true

class User::NotificationsController < User::ApplicationController
  def index
    render json: current_user.notifications.includes(:item).order(created_at: :desc).as_json(include: %i[item])
  end

  def mark_as_seen
    notification = current_user.notifications.find(params[:id])
    notification.update!(seen_at: Time.current)
    head :no_content
  end
end
