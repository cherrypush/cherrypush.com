# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user
  has_many :reports, dependent: :destroy

  validates :name, presence: true
  validates :user, presence: true

  enum access: { private: 'private', public: 'public' }, _suffix: :access
end
