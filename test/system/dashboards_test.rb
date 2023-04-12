# frozen_string_literal: true

require 'application_system_test_case'

class DashboardsTest < ApplicationSystemTestCase
  let!(:user) { create(:user) }
  let!(:project) { create(:project, user: user, name: 'rails/rails') }

  let!(:metric1) { create(:metric, project: project, name: 'JS LOC') }
  let!(:_report1) { create(:report, metric: metric1, value: 12, date: 1.day.ago) }
  let!(:_report2) { create(:report, metric: metric1, value: 9, date: 2.days.ago) }

  let!(:metric2) { create(:metric, project: project, name: 'TS LOC') }
  let!(:_report3) { create(:report, metric: metric2, value: 12, date: 10.day.ago) }
  let!(:_report4) { create(:report, metric: metric2, value: 9, date: 5.days.ago) }

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

    # dashboards/show
    assert_text 'TS Migration'
    assert_text 'No charts yet'
    click_on 'Add Chart'
    fill_in 'Title', with: 'Javascript'
    fill_in 'Metrics', with: 'JS LOC'
    find('li', text: 'JS LOC').click
    fill_in 'Metrics', with: 'TS LOC'
    find('li', text: 'TS LOC').click

    click_on 'Add Chart'
    assert_text 'New chart added to dashboard'
    assert_text 'Javascript'
    assert_text 'JS LOC'
    assert_text 'TS LOC'

    # Delete chart
    find('#chart-menu').click
    find('li', text: 'Delete').click
    assert_text 'Chart deleted'
    assert_no_text 'Javascript'

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
