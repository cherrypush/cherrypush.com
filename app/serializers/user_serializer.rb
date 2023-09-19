# frozen_string_literal: true

class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :github_handle
end
