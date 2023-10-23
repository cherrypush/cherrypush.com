class ApplicationRecord < ActiveRecord::Base
  include Skylight::Helpers

  primary_abstract_class
end
