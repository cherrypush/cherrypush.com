require 'test_helper'

class DatabaseCleanupJobTest < ActiveJob::TestCase
  let!(:project) { create :project }
  let!(:metric) { create :metric, project: project }
  let!(:report) { create :report, metric: metric, date: Time.current }
  let!(:occurrences) { create_list :occurrence, 2, report: report }
  let!(:old_report) { create :report, metric: metric, date: 1.year.ago }
  let!(:old_occurrences) { create_list :occurrence, 2, report: old_report }

  it 'older project occurrences are deleted' do
    assert_equal 4, Occurrence.count
    DatabaseCleanupJob.perform_now(project)
    assert_equal 0, Delayed::Job.count
    assert_equal 2, Occurrence.count
  end

  it 'schedules the job' do
    assert_equal 4, Occurrence.count
    perform_enqueued_jobs { DatabaseCleanupJob.perform_later(project) }
    assert_equal 2, Occurrence.count
  end
end
