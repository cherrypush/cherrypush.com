# frozen_string_literal: true

class Metric < ApplicationRecord
  belongs_to :project
  # has_many :reports, dependent: :destroy

  validates :name, presence: true
end
