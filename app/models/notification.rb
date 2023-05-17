# frozen_string_literal: true

class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :item, polymorphic: true

  validates :user, presence: true
  validates :item, presence: true
  validates :item_type, inclusion: { in: [Contribution.to_s] }
end
