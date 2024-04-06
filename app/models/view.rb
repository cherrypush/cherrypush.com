# frozen_string_literal: true

class View < ApplicationRecord
  belongs_to :user
  belongs_to :viewable, polymorphic: true
end
