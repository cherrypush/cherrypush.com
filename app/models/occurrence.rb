# frozen_string_literal: true

class Occurrence < ApplicationRecord
  belongs_to :report

  validates :name, presence: true
  validates :url, presence: true
end
