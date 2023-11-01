# frozen_string_literal: true

class UserMailer < ApplicationMailer
  include ApplicationHelper
  include ActionView::Helpers::DateHelper

  helper :application

  def weekly_report
    @user = params[:user]
    mail(to: @user.email, subject: "Cherry Report: #{Time.current.strftime("%b %d, %Y")} 🍒")
  end

  def welcome
    @user = params[:user]
    mail(to: @user.email, subject: "Welcome to Cherry 🍒")
  end

  def new_authorization_request
    @user = params[:user]
    @authorization_request = params[:authorization_request]
    mail(to: @user.email, subject: "Cherry - Authorization Request")
  end

  def authorization_granted
    @from_user = params[:from]
    @to_email = params[:to]
    @organization = params[:organization]
    mail(to: @to_email, subject: "Cherry - Authorization Granted")
  end

  def daily_notifications_report
    @user = params[:user]
    @notifications = @user.notifications.unseen.recent.order(created_at: :desc)
    mail(to: @user.email, subject: "Cherry - New Notifications (#{@notifications.count})")
  end

  def inactive_alert
    @user = params[:user]
    subject = "Reminder: Your Cherry account will be deleted in #{time_ago_in_words(@user.updated_at + 6.months)}"
    mail(to: @user.email, subject: subject)
  end
end
