# frozen_string_literal: true

require 'test_helper'

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  include SignInHelper
  include NavigationHelper

  Capybara.server = :puma, { Silent: true } # removes noisy logs when launching tests

  # PaintHolding makes Chrome keep displaying the old page during navigation, which causes
  # Selenium to reference stale DOM nodes and fail with "Node with given id does not belong
  # to the document". Disabling it lets the page clear immediately on navigation.
  common_options = %w[window-size=1400,1000 disable-search-engine-choice-screen disable-features=PaintHolding]

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
