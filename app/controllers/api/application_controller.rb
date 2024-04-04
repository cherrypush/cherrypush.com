# frozen_string_literal: true

class Api::ApplicationController < ApplicationController
  skip_before_action :verify_authenticity_token

  before_action :set_user

  # the ones at the bottom take precedence, so we rescue StandardError last
  rescue_from StandardError, with: :render_error
  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity
  rescue_from ActionController::ParameterMissing, with: :render_bad_request

  private

  def render_error(exception)
    raise exception unless @user&.admin?

    render json: { error: exception.message }, status: :internal_server_error
  end

  def render_bad_request(exception)
    render json: { error: exception.message }, status: :bad_request
  end

  def render_unprocessable_entity(exception)
    render json: { error: exception.message }, status: :unprocessable_entity
  end

  def set_user
    return render json: { error: 'API key is missing' }, status: :bad_request if params[:api_key].blank?

    @user = User.find_by(api_key: params[:api_key])
    render json: { error: wrong_api_key_message }, status: :unauthorized if @user.nil?
  end

  def wrong_api_key_message
    'Unknown API key. Find yours at https://cherrypush.com/user/settings.'
  end
end
