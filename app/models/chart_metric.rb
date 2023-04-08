# frozen_string_literal: true

class ChartMetric < ApplicationRecord
  belongs_to :chart
  has_one :metric
end
