# frozen_string_literal: true

class Report < ApplicationRecord
  belongs_to :metric

  validates :date, presence: true
  validates :value, presence: true
end
