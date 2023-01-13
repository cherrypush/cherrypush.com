# frozen_string_literal: true

class User::FavoritesController < User::ApplicationController
  def create
    if params[:project_id].present?
      current_user.favorite_project_ids << params[:project_id]
    elsif params[:metric_name].present?
      current_user.favorite_metric_names << params[:metric_name]
    elsif params[:owner_handle].present?
      current_user.favorite_owners << params[:owner_handle]
    end
    current_user.save!
    redirect_to request.referer, notice: 'Added to favorites.'
  end

  def destroy
    if params[:project_id].present?
      current_user.favorite_project_ids.delete params[:project_id].to_i
    elsif params[:metric_name].present?
      current_user.favorite_metric_names.delete(params[:metric_name])
    elsif params[:owner_handle].present?
      current_user.favorite_owners.delete(params[:owner_handle])
    end
    current_user.save!
    redirect_to request.referer, notice: 'Removed from favorites.'
  end
end
