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
end
