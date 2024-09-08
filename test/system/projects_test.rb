# frozen_string_literal: true

require 'application_system_test_case'

class ProjectsTest < ApplicationSystemTestCase
  let!(:user) { create :user }
  let!(:authorized_user) { create :user }
  let!(:organization) { create :organization, name: 'cherrypush' }
  let!(:_authorization) { create :authorization, email: authorized_user.email, organization: organization }
  let!(:project) { create :project, user: user, name: 'rails/rails', organization: organization }

  let!(:metric1) { create :metric, project: project, name: 'JS LOC' }
  let!(:_report1) { create :report, metric: metric1, value: 12, date: 4.day.ago }
  let!(:_report2) { create :report, metric: metric1, value: 9, date: 2.days.ago }

  let!(:metric2) { create :metric, project: project, name: 'TS LOC' }
  let!(:_report3) { create :report, metric: metric2, value: 12, date: 10.day.ago }
  let!(:_report4) { create :report, metric: metric2, value: 9, date: 5.days.ago }

  it 'does not allow authorized users to delete the project' do
    # Sign in as authorized user (not owner)
    sign_in(authorized_user, to: user_projects_path)
    find('tr', text: 'rails/rails').click

    # Refuses to delete project
    find('[data-testid="project-menu"]').click
    find('li', text: 'Delete project').click
    assert_text 'You are not authorized to perform this action.'
  end

  it 'allows the project owner to delete the project' do
    # Sign in as owner
    sign_in(user, to: user_projects_path)
    find('tr', text: 'rails/rails').click

    # Can delete project
    find('[data-testid="project-menu"]').click
    find('li', text: 'Delete project').click
    assert_text 'Deleting project...'
    assert_text 'Project deleted'
    assert_equal 0, Project.count
    assert_equal 0, Metric.count

    # Assert that the current path is /user/projects
    assert_current_path user_projects_path
  end
end
