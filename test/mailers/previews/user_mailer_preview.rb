# frozen_string_literal: true

class UserMailerPreview < ActionMailer::Preview
  def weekly_report
    UserMailer.with(user: User.first).weekly_report
  end

  def welcome
    UserMailer.with(user: User.first).welcome
  end

  def new_authorization_request
    authorization_request = AuthorizationRequest.find_or_create_by!(user: User.first, project: Project.first)
    UserMailer.with(user: User.first, authorization_request: authorization_request).new_authorization_request
  end

  def authorization_granted
    UserMailer.with(from: User.first, to: User.last, project: Project.first).authorization_granted
  end
end
