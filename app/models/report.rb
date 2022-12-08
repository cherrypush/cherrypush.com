# frozen_string_literal: true

class Report < ApplicationRecord
  belongs_to :project
  has_many :occurrences, dependent: :destroy

  validates :commit_sha, presence: true
end
