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
    return if metric.watcher_ids.empty?

    users = User.where(id: metric.watcher_ids)
    users.each { |user| Notification.create(user_id: user.id, item_id: id, item_type: self.class) }
  end
end
