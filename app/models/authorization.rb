# frozen_string_literal: true

class Authorization < ApplicationRecord
  belongs_to :project
  belongs_to :user
end
