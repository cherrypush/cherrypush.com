# frozen_string_literal: true

class User::FavoritesController < User::ApplicationController
  def create
    if params.require(:klass) == 'Metric'
      metric = Metric.find(params[:id])
      current_user.favorite_metric_ids << metric.id
      TelegramClient.send("#{current_user.name} added to favorites: #{metric.name}")
    end

    current_user.save!
    head :ok
  end

  def destroy
    current_user.favorite_metric_ids.delete(params[:id].to_i) if params.require(:klass) == 'Metric'
    current_user.save!
    head :ok
  end
end
