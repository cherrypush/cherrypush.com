require 'test_helper'

class ProjectTest < ActiveSupport::TestCase
  describe '#owners' do
    let!(:user) { create(:user) }
    let!(:project) { create(:project, user: user, updated_at: 1.day.ago) }
    let!(:metric) { create(:metric, project: project, updated_at: 1.day.ago) }

    it 'updates the updated_at field when a new report is created' do
      create(:report, metric: metric)
      assert_equal Time.current.to_date, metric.reload.updated_at.to_date
      assert_equal Time.current.to_date, project.reload.updated_at.to_date
    end
  end

  describe 'when chart metrics are present' do
    let!(:metric) { create(:metric) }
    let!(:chart_metric) { create(:chart_metric, metric: metric) }

    it 'can still delete the metric' do
      assert_equal 1, ChartMetric.count
      assert_equal 1, Metric.count
      metric.destroy!
      assert_equal 0, ChartMetric.count
      assert_equal 0, Metric.count
    end
  end

  describe '#delete_old_occurrences!' do
    let!(:metric1) { create(:metric) }
    let!(:report1A) { create(:report, metric: metric1, date: 6.days.ago) }
    let!(:report1B) { create(:report, metric: metric1, date: 3.hours.ago) }
    let!(:report1C) { create(:report, metric: metric1, date: Time.current) }

    let!(:metric2) { create(:metric) }
    let!(:report2A) { create(:report, metric: metric2, date: 60.days.ago) }

    before do
      add_occurrences(report1A)
      add_occurrences(report1B)
      add_occurrences(report1C)
      add_occurrences(report2A)
    end

    it 'deletes all occurrences except the most recent one' do
      assert_equal 2, Project.count
      assert_equal 12, Occurrence.count
      Metric.all.each(&:delete_old_occurrences!)
      assert_equal 0, report1A.occurrences.count
      assert_equal 0, report1B.occurrences.count
      assert_equal 3, report1C.occurrences.count
      assert_equal 3, report2A.occurrences.count
    end
  end

  private

  def add_occurrences(report)
    create(:occurrence, report: report)
    create(:occurrence, report: report)
    create(:occurrence, report: report)
  end
end
