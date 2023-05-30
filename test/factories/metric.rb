# frozen_string_literal: true

require 'factory_bot'

FactoryBot.define do
  factory :metric do
    project
    name { Faker::Lorem.word }
  end
end
