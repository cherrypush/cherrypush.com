# frozen_string_literal: true

class UserMailer < ApplicationMailer
  include ApplicationHelper
  helper :application

  def weekly_report
    @user = params[:user]
    mail(to: @user.email, subject: 'Weekly Report 🍒')
  end
end
