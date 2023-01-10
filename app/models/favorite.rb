# frozen_string_literal: true

class Favorite < ApplicationRecord
  # https://github.com/jonhue/acts_as_favoritor
  extend ActsAsFavoritor::FavoriteScopes

  belongs_to :favoritable, polymorphic: true
  belongs_to :favoritor, polymorphic: true
end
