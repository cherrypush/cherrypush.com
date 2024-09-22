# frozen_string_literal: true

require 'application_system_test_case'

class ContributionsTest < ApplicationSystemTestCase
  let!(:user) { create(:user) }
  let!(:organization) { create :organization, user: user }
  let!(:project) { create(:project, user: user, organization: organization) }
  let!(:metric) { create(:metric, project: project) }
  let!(:contribution) { create(:contribution, metric: metric, commit_url: 'https://host.com/commit/123456') }

  it 'applies filters to metrics' do
    sign_in(user, to: "/user/projects?project_id=#{project.id}&metric_id=#{metric.id}")
    within('[data-test-id="recent-commits"]') do
      new_window = window_opened_by { find('tbody tr').click }
      within_window(new_window) { assert_current_path 'https://host.com/commit/123456' }
    end
  end
end
