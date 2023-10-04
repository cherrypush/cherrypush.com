# frozen_string_literal: true

namespace :mailers do
  # This is run every day at 7 AM UTC by Heroku Scheduler, but emails are only sent on Mondays.
  # Run via: https://dashboard.heroku.com/apps/cherrypush-production/scheduler
  desc "Deliver weekly report"
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
  desc "Deliver daily notifications"
  task deliver_daily_notifications: :environment do
    User.all.each do |user|
      next if user.email.blank?
      next if user.projects.none?
      next if user.notifications.unseen.recent.none?

      UserMailer.with(user: user).daily_notifications_report.deliver_now
    end
  end

  desc "Import contacts to Brevo"
  task "sync:brevo" => :environment do
    total = User.count
    User.all.shuffle.each_with_index do |user, index|
      BrevoContact.create!(
        first_name: user.name.split.first.titleize,
        last_name: user.name.split.last.titleize,
        email: user.email,
      )
      puts "Created contact #{index + 1}/#{total}: #{user.name}"
    rescue StandardError
      BrevoContact.update!(first_name: user.name.split.first, last_name: user.name.split.last, email: user.email)
      puts "Updated contact #{index + 1}/#{total}: #{user.name}"
    end
  end
end
