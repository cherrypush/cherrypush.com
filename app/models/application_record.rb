# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  include Skylight::Helpers
  include Rails.application.routes.url_helpers

  primary_abstract_class
end
