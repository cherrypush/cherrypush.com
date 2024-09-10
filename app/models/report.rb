# frozen_string_literal: true

class Report < ApplicationRecord
  belongs_to :metric
  after_save { metric.touch }

  has_many :occurrences, dependent: :destroy

  validates :date, presence: true
  validates :value, presence: true

  def owners
    return [] if value_by_owner.nil?

    value_by_owner.map { |handle, count| Owner.new(handle: handle, count: count) }.sort_by(&:count).reverse
  end
end
