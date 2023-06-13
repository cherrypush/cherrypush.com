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
end
