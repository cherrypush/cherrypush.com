# frozen_string_literal: true

class Occurrence < ApplicationRecord
  belongs_to :report

  validates :text, presence: true
  validates :url, presence: true
end
