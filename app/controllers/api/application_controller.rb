# frozen_string_literal: true

class Api::ApplicationController < ApplicationController
  skip_before_action :verify_authenticity_token # TODO: implement auth using api keys

  before_action :set_user

  private

  def set_user
    @user = User.find_by(api_key: params.require(:api_key))
    head :unauthorized if @user.nil?
  end
end
