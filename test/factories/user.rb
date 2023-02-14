# frozen_string_literal: true

require 'factory_bot'

FactoryBot.define do
  factory :user do
    name { 'Flavio' }
    email { 'flavio@example.com' }
    api_key { Faker::Crypto.sha1 }
    github_handle { Faker::Internet.username }
  end
end
