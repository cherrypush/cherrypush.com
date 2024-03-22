# frozen_string_literal: true

require_relative 'boot'

# Require specific parts of rails
# https://github.com/rails/rails/blob/main/railties/lib/rails/all.rb
require 'rails'
require 'active_record/railtie'
require 'action_controller/railtie'
require 'action_view/railtie'
require 'action_mailer/railtie'
require 'active_job/railtie'
require 'rails/test_unit/railtie'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

class Cherry::Application < Rails::Application
  # Initialize configuration defaults for originally generated Rails version.
  config.load_defaults 7.0

  # Configuration for the application, engines, and railties goes here.
  #
  # These settings can be overridden in specific environments using the files
  # in config/environments, which are processed later.
  #
  # config.time_zone = "Central Time (US & Canada)"
  # config.eager_load_paths << Rails.root.join("extras")

  # PROJECT-SPECIFIC

  # To prevent an error while precompiling assets. First happened after adding sassc-rails gem.
  # Read: https://github.com/tailwindlabs/tailwindcss/discussions/6738#discussioncomment-2010199
  config.assets.css_compressor = nil
end
