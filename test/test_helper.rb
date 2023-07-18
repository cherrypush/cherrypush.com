ENV['RAILS_ENV'] ||= 'test'

require_relative '../config/environment'
require 'rails/test_help'
require 'minitest/stub_const'

# PROJECT SPECIFIC
require 'minitest/mock'
Dir[Rails.root.join('test', 'helpers', '**', '*.rb')].each { |file| require file }
require 'application_integration_test'

class ActiveSupport::TestCase
  include FactoryBot::Syntax::Methods

  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
  Rails.application.load_tasks
end

def let!(name, &block)
  let(name, &block)
  before { send(name) }
end
