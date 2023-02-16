require 'test_helper'

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  include SignInHelper

  Capybara.register_driver :headless_chrome do |app|
    options = Selenium::WebDriver::Chrome::Options.new(args: %w[headless window-size=1400,1000])
    Capybara::Selenium::Driver.new(app, browser: :chrome, capabilities: options)
  end

  Capybara.register_driver(:chrome) do |app|
    options = Selenium::WebDriver::Chrome::Options.new(args: %w[window-size=1400,1000])
    Capybara::Selenium::Driver.new(app, browser: :chrome, capabilities: options)
  end

  ENV['HEADLESS'] ? driven_by(:headless_chrome) : driven_by(:chrome)
end
