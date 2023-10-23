# frozen_string_literal: true

class Authorization < ApplicationRecord
  belongs_to :organization
  belongs_to :user, optional: true # TODO: remove once migrated to use emails

  validates :email, presence: true
end
