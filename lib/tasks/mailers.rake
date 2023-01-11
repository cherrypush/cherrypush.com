# frozen_string_literal: true

namespace :mailers do
  desc 'Deliver weekly report'
  task deliver_weekly_report: :environment do
    User.all.each do |user|
      next if user.email.blank?
      next if user.projects.none?

      UserMailer.with(user: user).weekly_report.deliver_now
    end
  end
end
