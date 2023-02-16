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

    create(
      :report,
      metric: create(:metric, project: create(:project, user: user, name: 'rails/rails'), name: 'rubocop'),
      value: 12,
      date: Time.current,
    )

    click_on 'Projects'
    click_on 'rails/rails'
    assert_text 'Project: rails/rails'
    click_on 'rubocop'
    assert_text 'Metric: rubocop'
    assert_text 'You can start using owners on your project by adding a CODEOWNERS file to your repository'
  end
end
