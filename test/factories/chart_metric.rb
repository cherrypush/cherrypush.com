# frozen_string_literal: true

require 'factory_bot'

FactoryBot.define do
  factory :chart_metric do
    metric
    chart
  end
end
