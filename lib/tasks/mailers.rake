# frozen_string_literal: true

namespace :mailers do
  desc 'Deliver weekly report'
  task deliver_weekly_report: :environment do
    next unless Time.current.monday?

    User.all.each do |user|
      next if user.email.blank?
      next if user.projects.none?

      UserMailer.with(user: user).weekly_report.deliver_now
    end
  end

  desc 'Deliver daily notifications'
  task deliver_daily_notifications: :environment do
    next unless Time.current.monday?

    User.all.each do |user|
      next if user.email.blank?
      next if user.projects.none?

      UserMailer.with(user: user).daily_notifications_report.deliver_now
    end
  end
end
