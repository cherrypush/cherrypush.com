# frozen_string_literal: true

class AuthorizationRequest < ApplicationRecord
  belongs_to :project
  belongs_to :user
end
