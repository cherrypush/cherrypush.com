# frozen_string_literal: true

class User::FavoritesController < User::ApplicationController
  def create
    current_user.favorite_metric_ids << params[:id].to_i if params['type'] == 'metric'
    current_user.save!
    head :ok
    TelegramClient.send("#{current_user.name} favorited a metric: #{user_metrics_url(metric_id: params[:id])}")
  end

  def destroy
    current_user.favorite_metric_ids.delete(params[:id].to_i) if params['type'] == 'metric'
    current_user.save!
    head :ok
  end
end
