# frozen_string_literal: true

require 'test_helper'

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  include SignInHelper
  include NavigationHelper

  Capybara.server = :puma, { Silent: true } # removes noisy logs when launching tests

  common_options = %w[window-size=1400,1000 disable-search-engine-choice-screen]

  Capybara.register_driver :headless_chrome do |app|
    options = Selenium::WebDriver::Chrome::Options.new(args: %w[headless].concat(common_options))
    Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
  end

  Capybara.register_driver(:chrome) do |app|
    options = Selenium::WebDriver::Chrome::Options.new(args: common_options)
    Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
  end

  ENV['HEADLESS'] ? driven_by(:headless_chrome) : driven_by(:chrome)
end
