# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.2.0'

# default rails gems
gem 'bootsnap', require: false
gem 'jbuilder' # Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem 'pg', '~> 1.1'
gem 'puma', '~> 5.0'
gem 'rails', '~> 7.0.4'
gem 'sprockets-rails'

# authentication
gem 'omniauth'
gem 'omniauth-github', github: 'omniauth/omniauth-github', branch: 'master'

# project-specific dependencies
gem 'blazer'
gem 'chartkick'
gem 'faker' # also used by production code via rake demo:refresh
gem 'groupdate'
gem 'heroicon'
gem 'httparty'
gem 'pundit'
gem 'redcarpet' # for markdown rendering
gem 'sendgrid-ruby'
gem 'sentry-rails'
gem 'sentry-ruby'
gem 'tailwindcss-rails'
gem 'vite_rails'

# Use JavaScript with ESM import maps [https://github.com/rails/importmap-rails]
# gem 'importmap-rails'

# Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem 'turbo-rails'

# Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
# gem 'stimulus-rails'

# Use Redis adapter to run Action Cable in production
# gem "redis", "~> 4.0"

# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
# gem "kredis"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
# gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]

# Use Sass to process CSS
# gem "sassc-rails"

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"

group :development, :test do
  # project-specific
  gem 'factory_bot'
  gem 'pry'

  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', platforms: %i[mri mingw x64_mingw]
end

group :development do
  # debugging
  gem 'better_errors'
  gem 'binding_of_caller'

  # project-specific
  gem 'parity'
  gem 'rubocop', require: false
  gem 'syntax_tree'

  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem 'web-console'

  # Add speed badges [https://github.com/MiniProfiler/rack-mini-profiler]
  # gem "rack-mini-profiler"

  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem "spring"
end

group :test do
  gem 'minitest-spec-rails' # for rspec-like syntax

  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem 'capybara'
  gem 'selenium-webdriver'
  gem 'webdrivers'
end

gem 'importmap-rails', '~> 1.1'
