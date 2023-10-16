# frozen_string_literal: true

require "factory_bot"

FactoryBot.define do
  factory :user do
    name { Faker::Artist.name }
    email { Faker::Internet.email }
    api_key { Faker::Crypto.sha1 }
    github_handle { Faker::Internet.username }
    provider { "google_oauth2" }
    uid { Faker::Crypto.sha1 }
    image { Faker::LoremFlickr.image }
  end
end
