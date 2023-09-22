# frozen_string_literal: true

class Authorization < ApplicationRecord
  belongs_to :organization
  belongs_to :user
end
