# frozen_string_literal: true

class Membership < ApplicationRecord
  belongs_to :organization

  enum kind: { team: "team", organization: "organization" }, _suffix: :kind
end
