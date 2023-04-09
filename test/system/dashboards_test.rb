require 'application_system_test_case'

class DashboardsTest < ApplicationSystemTestCase
  let!(:user) { create(:user) }
  let!(:project) { create(:project, user: user, name: 'rails/rails') }
  let!(:metric) { create(:metric, project: project, name: 'JS LOC') }

  it 'allows new users to request access to projects' do
    sign_in(user, to: user_dashboards_path)

    # dashboards/index
    assert_text 'Dashboards'
    assert_text 'No dashboards yet'
    click_on 'New Dashboard'
    fill_in 'Select a project...', with: 'rails/rails'
    find('li', text: 'rails/rails').click
    fill_in 'Dashboard name', with: 'TS Migration'
    click_on 'Create'
    assert_text 'Dashboard created'
    assert_text 'TS Migration'
    assert_text 'rails/rails'
    find('tr', text: 'TS Migration').click

    # dashboards/show
    assert_text 'No charts yet'
    click_on 'Add Metric'
    fill_in 'Select a metric...', with: 'JS LOC'
    find('li', text: 'JS LOC').click
    click_on 'Add Metric'
    assert_text 'New metric added to dashboard'

    # Delete chart
    assert_text 'JS LOC'
    find('#chart-menu').click
    find('li', text: 'Delete').click
    assert_text 'Chart deleted'
    assert_no_text 'JS LOC'

    # Rename dashboard
    find('#dashboard-menu').click
    find('li', text: 'Rename dashboard').click
    fill_in 'Name', with: ''
    fill_in 'Name', with: 'Tech Vitals'
    click_on 'Rename'
    assert_text 'Dashboard updated'

    # Delete dashboard
    find('#dashboard-menu').click
    find('li', text: 'Delete dashboard').click
    assert_text 'Dashboard deleted'
    assert_text 'No dashboards yet'
  end
end
