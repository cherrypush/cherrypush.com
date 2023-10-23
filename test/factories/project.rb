# frozen_string_literal: true

require "factory_bot"

FactoryBot.define do
  factory :project do
    name { Faker::Lorem.word }
    user { create(:user) }
  end
end
