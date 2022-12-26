# frozen_string_literal: true

class Report < ApplicationRecord
  belongs_to :project

  validates :commit_sha, presence: true
  validates :commit_date, presence: true
  validates :metrics, presence: true

  def total
    metrics.values.map { |metric| metric['total'] }.sum
  end
end
