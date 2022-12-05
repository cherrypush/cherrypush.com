# frozen_string_literal: true

class Api::ApplicationController < ApplicationController
  skip_before_action :verify_authenticity_token

  before_action :set_user

  private

  def set_user
    return render json: { error: 'API key is missing' }, status: :bad_request if params[:api_key].blank?
    @user = User.find_by(api_key: params[:api_key])
    return render json: { error: 'User not found' }, status: :unauthorized if @user.nil?
  end
end
