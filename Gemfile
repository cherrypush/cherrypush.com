# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.2.1"

# default gems
gem "bootsnap", require: false
gem "pg", "~> 1.1"
gem "puma", "~> 5.0"
gem "rails", "~> 7.0.4"
gem "sprockets-rails"

# authentication
gem "omniauth"
gem "omniauth-github", github: "omniauth/omniauth-github", branch: "master"
gem "omniauth-rails_csrf_protection"

# admin
gem "blazer"

# monitoring & performance
gem "delayed_job_active_record"
gem "hiredis"
gem "redis"
gem "sentry-rails"
gem "sentry-ruby"
gem "skylight" # performance monitoring

# project-specific dependencies
gem "groupdate"
gem "heroicon"
gem "httparty"
gem "kaminari"
gem "pundit"
gem "redcarpet" # for markdown rendering
gem "tailwindcss-rails"
gem "vite_rails"

# Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
# gem 'stimulus-rails'

# Use Redis adapter to run Action Cable in production
# gem "redis", "~> 4.0"

# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
# gem "kredis"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
# gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[mingw mswin x64_mingw jruby]

# Use Sass to process CSS
# gem "sassc-rails"

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"

group :development, :test do
  # project-specific
  gem "factory_bot_rails"
  gem "faker"
  gem "pry"

  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[mri mingw x64_mingw]
end

group :development do
  # debugging
  gem "better_errors"
  gem "binding_of_caller"

  # performance
  gem "derailed_benchmarks" # CUT_OFF=0.3 bundle exec derailed bundle:mem
  gem "rack-mini-profiler"
  gem "stackprof" # for call-stack profiling flamegraphs

  # project-specific
  gem "parity"
  gem "rubocop", require: false
  gem "syntax_tree"

  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console"

  # docker integration
  gem "dockerfile-rails"
end

group :test do
  gem "minitest-spec-rails" # for rspec-like syntax
  gem "minitest-stub-const" # for stubbing constants

  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem "capybara"
  gem "selenium-webdriver"
end
