# frozen_string_literal: true

class Dashboard < ApplicationRecord
  belongs_to :project
  has_many :charts, dependent: :destroy

  validates :name, presence: true
end
