# frozen_string_literal: true

namespace :database do
  desc "Anonymize all data"
  task anonymize: :environment do
    raise "This task is not allowed in production" if Rails.env.production?

    ActiveRecord::Base.logger = nil

    User.all.each do |user|
      user.update!(name: Faker::Name.name, email: Faker::Internet.email, github_handle: Faker::Internet.username)
    end

    users = User.all.to_a

    occurrences = Occurrence.where.not(owners: nil)
    occurrences
      .in_batches(of: 1000)
      .each_with_index do |occurrence_group, index|
        puts "Occurrence batch #{index} of #{occurrences.count / 1000}"
        occurrence_group.update_all(owners: [users.sample.github_handle])
      end

    projects = Project.all
    projects.each_with_index do |project, index|
      puts "Project #{index} of #{projects.count}"
      project.update!(name: "cherry/#{Faker::Adjective.positive}")
      project.metrics.each do |metric|
        metric.contributions.each do |contribution|
          contribution.update!(author_name: users.sample.name, author_email: users.sample.email)
        end
      end
    end

    # TODO: update owner names on reports value by owner
  end

  # This is regularly run by the Heroku Scheduler
  # https://dashboard.heroku.com/apps/cherrypush-production/scheduler
  desc "Clean up database"
  task cleanup: :environment do
    Project.all.each { |project| project.metrics.each(&:clean_up!) }
  end
end
