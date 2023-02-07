# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user

  has_many :metrics, dependent: :destroy
  has_many :reports, through: :metrics
  has_many :contributions, dependent: :destroy
  has_many :authorizations, dependent: :destroy

  validates :name, presence: true
  validates :user, presence: true

  def chart_data
    reports.group_by_day(:date, range: 4.weeks.ago..Time.now).count
  end

  def owners
    latest_report
      .metrics
      .each_with_object([]) do |(_metric_name, metric), owner_handles|
        metric['owners'].each { |handle, _count| owner_handles << handle }
      end
      .uniq
      .sort
      .map { |owner| Owner.new(handle: owner) }
  end
end
