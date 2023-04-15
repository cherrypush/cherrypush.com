# frozen_string_literal: true

class ChartMetric < ApplicationRecord
  belongs_to :chart
  belongs_to :metric
end
