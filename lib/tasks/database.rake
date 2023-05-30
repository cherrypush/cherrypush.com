# frozen_string_literal: true

namespace :database do
  # Run via: https://dashboard.heroku.com/apps/cherrypush-production/scheduler
  desc 'Delete old occurrences'
  task delete_old_occurrences: :environment do
    Project.all.each(&:delete_old_occurrences!)
  end
end
