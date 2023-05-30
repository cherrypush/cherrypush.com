# frozen_string_literal: true

require 'factory_bot'

FactoryBot.define do
  factory :occurrence do
    report
    text { Faker::Lorem.sentence }
    url { Faker::Internet.url }
  end
end
