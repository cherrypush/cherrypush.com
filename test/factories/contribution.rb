# frozen_string_literal: true

require 'factory_bot'

FactoryBot.define do
  factory :contribution do
    author_name { Faker::Name.name }
    author_email { Faker::Internet.email }
    diff { Faker::Number.number(digits: 2) }
    commit_sha { Faker::Crypto.sha1 }
    commit_date { Faker::Date.backward }
  end
end
