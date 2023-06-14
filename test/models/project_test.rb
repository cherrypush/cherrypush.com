require 'test_helper'

class ProjectTest < ActiveSupport::TestCase
  describe '#owners' do
    let!(:user) { create(:user) }
    let!(:project) { create(:project, user: user) }
    let!(:metric1) { create(:metric, project: project) }
    let!(:report1) { create(:report, metric: metric1, value_by_owner: { '@fwuensche' => 12, '@rchoquet' => 10 }) }

    let!(:metric2) { create(:metric, project: project) }
    let!(:report2) { create(:report, metric: metric2, value_by_owner: { '@fwuensche' => 12, '@rchoquet' => 10 }) }

    it 'returns a list of owners for the project' do
      assert_equal %w[@fwuensche @rchoquet], project.owners.map(&:handle).sort
    end
  end

  describe '#delete_old_occurrences!' do
    let!(:metric1) { create(:metric) }
    let!(:report1) { create(:report, metric: metric1, date: 6.days.ago) }
    let!(:report2) { create(:report, metric: metric1, date: 3.days.ago) }
    let!(:recent_report) { create(:report, metric: metric1, date: 6.hours.ago) }
    let!(:most_recent_report1) { create(:report, metric: metric1, date: 3.hours.ago) }

    let!(:metric2) { create(:metric) }
    let!(:most_recent_report2) { create(:report, metric: metric2, date: 60.days.ago) }

    before do
      add_occurrences(report1)
      add_occurrences(report2)
      add_occurrences(recent_report)
      add_occurrences(most_recent_report1)
      add_occurrences(most_recent_report2)
    end

    it 'deletes all occurrences except the most recent one' do
      assert_equal 2, Project.count
      assert_equal 15, Occurrence.count
      Project.all.each(&:delete_old_occurrences!)
      assert_equal 0, report1.occurrences.count
      assert_equal 0, report2.occurrences.count
      assert_equal 3, recent_report.occurrences.count
      assert_equal 3, most_recent_report1.occurrences.count
      assert_equal 3, most_recent_report2.occurrences.count
    end
  end

  private

  def add_occurrences(report)
    create(:occurrence, report: report)
    create(:occurrence, report: report)
    create(:occurrence, report: report)
  end
end
