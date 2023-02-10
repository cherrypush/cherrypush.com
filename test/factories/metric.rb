# frozen_string_literal: true

require 'factory_bot'

FactoryBot.define do
  factory :metric do
    name { Faker::Lorem.word }
  end
end
