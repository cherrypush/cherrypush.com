# frozen_string_literal: true

class UserMailer < ApplicationMailer
  include ApplicationHelper
  helper :application

  def weekly_report
    @user = params[:user]
    mail(to: @user.email, subject: "Cherry Report: #{Time.current.strftime('%b %d, %Y')} 🍒")
  end
end
