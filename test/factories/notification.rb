# frozen_string_literal: true

require 'factory_bot'

FactoryBot.define do
  factory :notification do
    user
    association :item, factory: :contribution
  end
end
