# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user

  has_many :metrics, dependent: :destroy
  has_many :reports, through: :metrics
  has_many :authorizations, dependent: :destroy

  validates :name, presence: true
  validates :user, presence: true

  def chart_data
    reports.group_by_day(:date, range: 4.weeks.ago..Time.now).count
  end

  def owners
    metrics.map(&:owners).flatten.uniq.sort_by(&:handle)
  end
end
