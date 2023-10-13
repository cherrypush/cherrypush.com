# frozen_string_literal: true

class User::NotificationsController < User::ApplicationController
  PER_PAGE = 20

  def index
    render json:
             current_user
               .notifications
               .page(current_page)
               .per(PER_PAGE)
               .includes(:item)
               .order(created_at: :desc)
               .as_json(include: %i[item])
  end

  def mark_as_seen
    notification = current_user.notifications.find(params[:id])
    notification.update!(seen_at: Time.current)
    head :no_content
  end

  def mark_all_as_seen
    current_user.notifications.update_all(seen_at: Time.current)
    head :no_content
  end

  private

  def current_page
    params[:page] || 1
  end
end
