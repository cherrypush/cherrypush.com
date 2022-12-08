# frozen_string_literal: true

require 'factory_bot'

FactoryBot.define do
  factory :membership do
    user
  end
end
