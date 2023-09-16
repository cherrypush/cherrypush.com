# frozen_string_literal: true

class AuthorizationRequest < ApplicationRecord
  belongs_to :organization
  belongs_to :user
end
