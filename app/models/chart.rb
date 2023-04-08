# frozen_string_literal: true

class Chart < ApplicationRecord
  belongs_to :dashboard
  has_many :chart_metrics, dependent: :destroy
end
