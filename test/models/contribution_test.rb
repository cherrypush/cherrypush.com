require "test_helper"

class ContributionTest < ActiveSupport::TestCase
  describe "#notify_watchers!" do
    it "creates one notification per watcher" do
      user = create :user
      metric = create :metric, watcher_ids: [user.id]
      contribution = create :contribution, metric: metric
      assert_difference -> { Notification.count }, 1 do
        contribution.notify_watchers!
      end
    end

    it "handles ids of deleted users" do
      user = create :user
      metric = create :metric, watcher_ids: [user.id, 999]
      contribution = create :contribution, metric: metric
      assert_difference -> { Notification.count }, 1 do
        contribution.notify_watchers!
      end
    end
  end
end
