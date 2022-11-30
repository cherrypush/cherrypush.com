# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user
  has_many :occurrences

  validates :name, presence: true
end
