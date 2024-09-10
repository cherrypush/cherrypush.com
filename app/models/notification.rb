# frozen_string_literal: true

class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :item, polymorphic: true

  validates :user, presence: true
  validates :item, presence: true
  validates :item_type, inclusion: { in: [Contribution.to_s] }

  scope :unseen, -> { where(seen_at: nil) }
  scope :recent, -> { where('created_at > ?', 24.hours.ago) }

  def message
    case item
    when Contribution
      "#{item.author_name} contributed to #{item.metric.name}: #{item.diff}"
    else
      raise "Unknown notification item type: #{item.class}"
    end
  end

  def unsubscribe_url
    case item
    when Contribution
      Rails.application.routes.url_helpers.user_projects_url(
        project_id: item.metric.project_id,
        metric_id: item.metric_id
      )
    else
      raise "Unknown notification item type: #{item.class}"
    end
  end
end
