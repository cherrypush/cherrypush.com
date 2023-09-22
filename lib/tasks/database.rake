# frozen_string_literal: true

namespace :database do
  desc "Anonymize all data"
  task anonymize: :environment do
    raise "This task is not allowed in production" if Rails.env.production?

    User.all.each do |user|
      user.update!(name: Faker::Name.name, email: Faker::Internet.email, github_handle: Faker::Internet.username)
    end

    Project.all.each do |project|
      project.update!(name: "cherry/#{Faker::Adjective.positive}")
      project.metrics.each do |metric|
        metric.contributions.each do |contribution|
          contribution.update!(author_name: User.all.sample.name, author_email: User.all.sample.email)
        end
      end
    end
  end

  # This is regularly run by the Heroku Scheduler
  # https://dashboard.heroku.com/apps/cherrypush-production/scheduler
  desc "Clean up database"
  task cleanup: :environment do
    Project.all.each { |project| project.metrics.each(&:clean_up!) }
  end
end
