# frozen_string_literal: true

namespace :database do
  desc "Anonymize all data"
  task anonymize: :environment do
    raise "This task is not allowed in production" if Rails.env.production?

    ActiveRecord::Base.logger = nil
    Organization.all.each { |organization| organization.update_column(:name, Faker::Internet.username) }
    update_occurrences

    User.all.each do |user|
      user.update!(name: Faker::Name.name, email: Faker::Internet.email, github_handle: Faker::Internet.username)
    end

    users = User.all.to_a
    projects = Project.all
    projects.each_with_index do |project, project_index|
      print "Starting project #{project_index + 1} of #{projects.count}"
      update_project_reports(project)

      project.update!(name: "cherry/#{Faker::Adjective.positive}")
      project.metrics.each_with_index do |metric, metric_index|
        print "Project #{project_index + 1} of #{projects.count}: metric #{metric_index + 1} of #{project.metrics.count}\n"
        metric
          .contributions
          .in_batches(of: 100)
          .each do |contribution_group|
            contribution_group.update_all(author_name: users.sample.name, author_email: users.sample.email)
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

  private

  def update_project_reports(project)
    project.metrics.each do |metric|
      metric
        .reports
        .last(100)
        .each { |report| report.update!(value_by_owner: owners.to_h { |owner| [owner, rand(100)] }) }
    end
  end

  def update_occurrences
    Occurrence
      .where.not(owners: nil)
      .in_batches(of: 1000)
      .each { |occurrence_group| occurrence_group.update_all(owners: [owners.sample]) }
  end

  def owners
    %w[@devops @billing @frontend @backend @design @support @payment]
  end
end
