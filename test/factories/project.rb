# frozen_string_literal: true

require "factory_bot"

FactoryBot.define do
  factory :project do
    name { "cherrypush/charry-cli" }
    user { create(:user) }
    organization
  end
end
