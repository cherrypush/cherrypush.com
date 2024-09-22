# frozen_string_literal: true

require 'application_system_test_case'

class ContributionsTest < ApplicationSystemTestCase
  let!(:user) { create(:user, name: 'Quentin', email: 'quentin@email.com', github_handle: 'quentinlem') }
  let!(:organization) { create :organization, user: user }
  let!(:project) { create(:project, user: user, name: 'rails/rails', organization: organization) }
  let!(:metric) { create(:metric, project: project, name: '[rubocop] Metrics/MethodLength') }
  let!(:contribution) { create(:contribution, metric: metric, author_name: 'Quentin', commit_url: 'https://host.com/commit/123456') }

  it 'applies filters to metrics' do
    sign_in(user, to: user_projects_path)
    find('tr', text: 'rails/rails').click
    find('tr', text: 'rubocop').click
    within('[data-test-id="recent-commits"]') do
      find('tr', text: 'Quentin').click
      assert_current_path 'https://host.com/commit/123456'
    end
  end
end
