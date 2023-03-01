require 'application_system_test_case'

class OnboardingTest < ApplicationSystemTestCase
  let!(:user) { create(:user, name: 'Flavio Wuensche', github_handle: 'fwuensche') }

  it 'goes through onboarding' do
    sign_in user
    assert_text 'First time here?'
    assert_text 'Create your first project'
    assert_text 'Docs'

    find('a', text: 'Metrics').click
    assert_text 'You need to create a project first' # shows a toast message
    assert_text 'Start a new project' # and redirects to '/projects/new'

    click_on 'Avatar'
    find('li', text: 'Authorizations').click
    assert_text 'Authorizations'
    assert_text 'You first need to create a project'

    project = create(:project, user: user, name: 'rails/rails')
    refresh
    find('a', text: 'Metrics').click
    assert_text 'Fill up your project with historic data by running the following command'

    create(:report, metric: create(:metric, project: project, name: 'rubocop'), value: 12, date: Time.current)
    refresh
    find('a', text: 'Projects').click
    find('tr', text: 'rails/rails').click
    find('tr', text: 'rubocop').click
    assert_text 'You can start using owners on your project by adding a CODEOWNERS file to your repository'
    assert_text 'Occurrences (0)'
  end
end
