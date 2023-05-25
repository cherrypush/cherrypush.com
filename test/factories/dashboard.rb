# frozen_string_literal: true

require 'factory_bot'

FactoryBot.define do
  factory :dashboard do
    name { Faker::Lorem.word }
  end
end
