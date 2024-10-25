# frozen_string_literal: true

source 'https://rubygems.org'

ruby '3.2.1'

# default gems
gem 'bootsnap', require: false
gem 'pg', '~> 1.1'
gem 'puma', '< 7'
gem 'rails'
gem 'sprockets-rails'

# authentication
gem 'omniauth'
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
gem 'skylight' # performance monitoring: https://www.skylight.io/app/applications/670fP418RH7v/recent/6h/endpoints

# project-specific dependencies
gem 'groupdate' # TODO: review if it's actually used in the app
gem 'heroicon' # TODO: since we're using react, do we actually still need this gem?
gem 'kaminari' # for pagination
gem 'pundit' # TODO: assess if it wouldn't be simpler to just rely on native rails for that
gem 'redcarpet' # for markdown rendering
gem 'stripe' # TODO: remove payment processing from this app, it over-complexifies the app for the current use
gem 'tailwindcss-rails'
gem 'vite_rails'

group :development, :test do
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'pry'

  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', platforms: %i[mri mingw x64_mingw] # TODO: review if this is really needed
end

group :development do
  # debugging
  gem 'better_errors'
  gem 'binding_of_caller' # FIX: commands such as continue not work while debugging with binding.pry

  # performance
  gem 'rack-mini-profiler'
  gem 'stackprof' # for call-stack profiling flamegraphs

  gem 'dockerfile-rails' # TODO: review if this is actually useful and remove otherwise
  gem 'parity' # CLI commands to simplify integration with Heroku apps (e.g, database sync, deployment, etc)
  gem 'rubocop', require: false # ruby linter
end

group :test do
  gem 'minitest-spec-rails' # allows rspec-like syntax
  gem 'minitest-stub-const' # provides stub_const helper for tests

  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem 'capybara'
  gem 'selenium-webdriver'
end
