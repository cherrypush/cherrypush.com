# frozen_string_literal: true

class Contribution < ApplicationRecord
  belongs_to :metric

  validates :commit_sha, presence: true
  validates :commit_date, presence: true
  validates :author_name, presence: true
  validates :author_email, presence: true
  validates :diff, presence: true
  validates :diff, numericality: { only_integer: true }

  def notify_watchers!
    # TODO: We should batch the creation of these notifications
    metric.watcher_ids.each { |user_id| Notification.create!(user_id: user_id, item: self) }
  end
end
