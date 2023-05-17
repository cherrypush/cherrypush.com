# frozen_string_literal: true

class UserMailer < ApplicationMailer
  include ApplicationHelper
  helper :application

  # TODO: fix the view to rely on the new metrics and reports model
  def weekly_report
    @user = params[:user]
    mail(to: @user.email, subject: "Cherry Report: #{Time.current.strftime('%b %d, %Y')} 🍒")
  end

  def welcome
    @user = params[:user]
    mail(to: @user.email, subject: 'Welcome to Cherry 🍒')
  end

  def new_authorization_request
    @user = params[:user]
    @authorization_request = params[:authorization_request]
    mail(to: @user.email, subject: 'New authorization request')
  end
end
