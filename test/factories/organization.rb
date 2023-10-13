# frozen_string_literal: true

require "factory_bot"

FactoryBot.define do
  factory :organization do
    user
    name { Faker::Lorem.word }
  end
end
