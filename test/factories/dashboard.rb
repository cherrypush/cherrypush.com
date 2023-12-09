# frozen_string_literal: true

require "factory_bot"

FactoryBot.define do
  factory :dashboard do
    name { Faker::Lorem.word }
    project
  end
end
