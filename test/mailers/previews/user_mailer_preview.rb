# frozen_string_literal: true

class UserMailerPreview < ActionMailer::Preview
  def weekly_report
    UserMailer.with(user: User.first).weekly_report
  end
end
