# frozen_string_literal: true

require 'factory_bot'

FactoryBot.define do
  factory :report do
    commit_date { Time.current }
    commit_sha { SecureRandom.hex(20) }
    metrics { { js_loc: { owners: { ditto: 431, pasta: 42 }, total: 473 }, react_query_v3: { owners: {}, total: 23 } } }
  end
end
