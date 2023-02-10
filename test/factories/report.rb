# frozen_string_literal: true

require 'factory_bot'

FactoryBot.define do
  factory :report do
    date { Time.current }
    value { Faker::Number.number(digits: 3) }
  end
end
