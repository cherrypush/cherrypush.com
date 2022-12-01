# frozen_string_literal: true

require 'factory_bot'

FactoryBot.define do
  factory :occurrence do
    commit_sha { Faker::Crypto.sha1 }
    file_path { 'app/controllers/occurrences_controller.rb' }
    line_number { 10 }
    metric_name { 'react_query_v1' }
  end
end
