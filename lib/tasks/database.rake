# frozen_string_literal: true

namespace :database do
  # Run via: https://dashboard.heroku.com/apps/cherrypush-production/scheduler
  desc 'Delete old occurrences'
  task delete_old_occurrences: :environment do
    Metric.all.each(&:delete_old_occurrences!)
  end

  desc 'Anonymize all data'
  task anonymize: :environment do
    User.all.each do |user|
      user.update!(name: Faker::Name.name, email: Faker::Internet.email, github_handle: Faker::Internet.username)
    end

    Project.all.each_with_index do |project, index|
      project.update!(name: "cherry/#{Faker::Adjective.positive}")
      project.metrics.each do |metric|
        metric.update!(name: Faker::BossaNova.song)
        metric.contributions.each do |contribution|
          contribution.update!(author_name: User.all.sample.name, author_email: User.all.sample.email)
        end
      end
    end
  end
end
