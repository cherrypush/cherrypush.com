# frozen_string_literal: true

class SessionsController < ApplicationController
  def create
    # Have a look at the info returned by the provider by uncommenting the next line:
    # render text: "<pre>" + env["omniauth.auth"].to_yaml and return
    omniauth = request.env['omniauth.auth']
    user = User.find_or_create_with_omniauth(omniauth)
    session[:user_id] = user.id
    flash[:notice] = "Signed in as #{user.name}"
    render_or_redirect
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url, notice: 'Signed out'
  end

  private

  def render_or_redirect
    page = request.env['omniauth.origin']
    if request.env['omniauth.params']['popup']
      @page = page
      render 'callback', layout: false
    else
      redirect_to page
    end
  end

  def pretty_name(provider_name)
    provider_name.titleize
  end
end
