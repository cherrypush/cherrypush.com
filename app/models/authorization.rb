# frozen_string_literal: true

class Authorization < ApplicationRecord
  belongs_to :project
  belongs_to :organization, optional: true # TODO: make it required after migration
  belongs_to :user
end
