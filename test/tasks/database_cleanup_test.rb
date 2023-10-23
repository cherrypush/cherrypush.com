# frozen_string_literal: true

require "test_helper"

class DatabaseCleanupTest < ActionMailer::TestCase
  let!(:project) { create :project }
  let!(:metric) { create :metric, project: project }
  let!(:report) { create :report, metric: metric, date: Time.current }
  let!(:occurrences) { create_list :occurrence, 2, report: report }
  let!(:old_report) { create :report, metric: metric, date: 1.year.ago }
  let!(:old_occurrences) { create_list :occurrence, 2, report: old_report }

  describe "database:cleanup" do
    it "deletes older project occurrences" do
      assert_equal 4, Occurrence.count
      Rake::Task["database:cleanup"].execute
      assert_equal 0, Delayed::Job.count
      assert_equal 2, Occurrence.count
    end
  end
end
