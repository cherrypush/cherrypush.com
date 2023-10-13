# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user
  belongs_to :organization, optional: true

  has_many :metrics, dependent: :destroy
  has_many :reports, through: :metrics
  has_many :dashboards, dependent: :destroy

  validates :name, presence: true
  validates :user, presence: true

  def owners
    # TODO: this is not necessarily the best way to get the owners, but it works for now
    Report.where(metric: metrics).order(date: :desc).limit(100).map(&:owners).flatten.uniq.sort_by(&:handle)
  end
end
