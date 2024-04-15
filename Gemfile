# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.2.1'

# default gems
gem 'bootsnap', require: false
gem 'pg', '~> 1.1'
gem 'puma', '~> 5.0'
gem 'rails', '~> 7.0.4'
gem 'sprockets-rails'

# authentication
gem 'omniauth'
gem 'omniauth-github', github: 'omniauth/omniauth-github', branch: 'master'
gem 'omniauth-google-oauth2'
gem 'omniauth-rails_csrf_protection'

# admin
gem 'blazer' # for querying the database

# monitoring & performance
gem 'delayed_job_active_record'
gem 'hiredis'
gem 'redis'
gem 'sentry-rails'
gem 'sentry-ruby'
gem 'skylight' # performance monitoring

# project-specific dependencies
gem 'groupdate'
gem 'heroicon'
gem 'kaminari' # for pagination
gem 'pundit'
gem 'redcarpet' # for markdown rendering
gem 'stripe'
gem 'tailwindcss-rails'
gem 'vite_rails'

group :development, :test do
  # project-specific
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'pry'

  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', platforms: %i[mri mingw x64_mingw]
end

group :development do
  # debugging
  gem 'better_errors'
  gem 'binding_of_caller'

  # performance
  gem 'rack-mini-profiler'
  gem 'stackprof' # for call-stack profiling flamegraphs

  # project-specific
  gem 'parity'
  gem 'rubocop', require: false

  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem 'web-console'

  # docker integration
  gem 'dockerfile-rails'
end

group :test do
  gem 'minitest-spec-rails' # allows rspec-like syntax
  gem 'minitest-stub-const' # provides stub_const for tests

  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem 'capybara'
  gem 'selenium-webdriver'
end
