require 'application_system_test_case'

class MetricsTest < ApplicationSystemTestCase
  test 'onboarding' do
    OmniAuth.config.test_mode = true
    Rails.application.env_config['omniauth.auth'] = github_auth

    visit root_url
    click_on 'Login with GitHub'
    assert_text 'Signed in as Flavio Wuensche'
    user = User.last
    assert_text 'Create your first project'
    assert_text 'Docs'

    click_on 'Metrics'
    assert_text 'You need to create a project first'

    click_on 'Authorizations'
    assert_text 'You first need to create a project'

    project = create(:project, user: user, name: 'rails/rails')
    metric = create(:metric, project: project, name: 'rubocop')
    report = create(:report, metric: metric, value: 12, date: Time.current)
    click_on 'Projects'
    click_on 'rails/rails'
    assert_text 'Project: rails/rails'
    click_on 'rubocop'
    assert_text 'Metric: rubocop'
    assert_text 'You can start using owners on your project by adding a CODEOWNERS file to your repository'
  end

  private

  def github_auth
    OmniAuth.config.mock_auth[:github] = OmniAuth::AuthHash.new(
      {
        provider: 'github',
        uid: '12345678910',
        info: {
          email: 'flavio@gmail-fake.com',
          first_name: 'Flavio',
          last_name: 'Wuensche',
          image: 'https://avatars.githubusercontent.com/u/1740848?v=4',
        },
        credentials: {
          token: 'abcdefgh12345',
          refresh_token: '12345abcdefgh',
          expires_at: DateTime.now,
        },
      },
    )
  end
end
