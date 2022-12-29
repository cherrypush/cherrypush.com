# frozen_string_literal: true

class SessionsController < ApplicationController
  def create
    # Have a look at the info returned by the provider by uncommenting the next line:
    # render text: "<pre>" + env["omniauth.auth"].to_yaml and return
    omniauth = request.env['omniauth.auth']
    user = User.find_or_create_with_omniauth(omniauth)
    session[:user_id] = user.id
    redirect_to after_sign_in_path, notice: "Signed in as #{user.name}"
    TelegramClient.send("New user signed in: #{user.name}")
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url, notice: 'Signed out'
  end

  private

  def after_sign_in_path
    request.env['omniauth.params']['after_sign_in_path'] || request.env['omniauth.origin']
  end
end
