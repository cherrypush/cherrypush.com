# frozen_string_literal: true

namespace :mailers do
  # This is run every day at 7 AM UTC by Heroku Scheduler, but emails are only sent on Mondays.
  # Run via: https://dashboard.heroku.com/apps/cherrypush-production/scheduler
  desc 'Deliver weekly report'
  task deliver_weekly_report: :environment do
    next unless Time.current.monday?

    User.all.each do |user|
      next if user.email.blank?
      next if user.projects.none?

      UserMailer.with(user: user).weekly_report.deliver_now
    end
  end

  # This is run every day at 7 PM UTC by Heroku Scheduler, but emails are only sent when there are notifications.
  # Run via: https://dashboard.heroku.com/apps/cherrypush-production/scheduler
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
