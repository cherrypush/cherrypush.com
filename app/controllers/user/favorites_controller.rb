# frozen_string_literal: true

class User::FavoritesController < User::ApplicationController
  def create
    if params.require(:klass) == "Metric"
      metric = Metric.find(params[:id])
      current_user.favorite_metric_ids << metric.id
      TelegramClient.send("#{current_user.name} added metric to favorites: #{metric.name}")
    elsif params[:klass] == "Dashboard"
      dashboard = Dashboard.find(params[:id])
      current_user.favorite_dashboard_ids << dashboard.id
      TelegramClient.send("#{current_user.name} added dashboard to favorites: #{dashboard.name}")
    end

    current_user.save!
    head :ok
  end

  def destroy
    current_user.favorite_metric_ids.delete(params[:id].to_i) if params.require(:klass) == "Metric"
    current_user.favorite_dashboard_ids.delete(params[:id].to_i) if params.require(:klass) == "Dashboard"
    current_user.save!
    head :ok
  end
end
