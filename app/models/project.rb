# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user
  has_many :reports, dependent: :destroy
  has_many :authorizations, dependent: :destroy

  validates :name, presence: true
  validates :user, presence: true

  enum access: { private: 'private', public: 'public' }, _suffix: :access

  def metrics
    reports.last.occurrences.map(&:metric_name).uniq.sort
  end

  def teams
    reports.last.occurrences.map(&:owners).flatten.uniq.sort
  end
end
