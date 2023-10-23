# frozen_string_literal: true

class AuthorizationRequest < ApplicationRecord
  belongs_to :project, optional: true # TODO: remove it once auth has been migrated to use organizations
  belongs_to :organization, optional: true # TODO: make it required once auth has been migrated to use organizations
  belongs_to :user
end
