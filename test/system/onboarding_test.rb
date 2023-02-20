require 'application_system_test_case'

class OnboardingTest < ApplicationSystemTestCase
  let!(:user) { create(:user, name: 'Flavio Wuensche', github_handle: 'fwuensche') }

  it 'goes through onboarding' do
    sign_in user
    assert_text 'Create your first project'
    assert_text 'Docs'

    click_on 'Metrics'
    assert_text 'You need to create a project first'

    click_on 'Authorizations'
    assert_text 'You first need to create a project'

    project = create(:project, user: user, name: 'rails/rails')
    click_on 'Metrics'
    assert_text 'Fill up your project with historic data by running the following command'

    create(:report, metric: create(:metric, project: project, name: 'rubocop'), value: 12, date: Time.current)

    click_on 'Projects'
    click_on 'rails/rails'
    assert_text 'Project: rails/rails'
    find('tr', text: 'rubocop').click
    assert_text 'You can start using owners on your project by adding a CODEOWNERS file to your repository'
  end
end
