# frozen_string_literal: true

class Contribution < ApplicationRecord
  belongs_to :metric

  validates :commit_sha, presence: true
  validates :commit_date, presence: true
  validates :author_name, presence: true
  validates :author_email, presence: true
  validates :diff, presence: true
  validates :diff, numericality: { only_integer: true }
end
