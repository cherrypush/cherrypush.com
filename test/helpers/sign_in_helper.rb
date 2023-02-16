# frozen_string_literal: true

module SignInHelper
  def sign_in(user, to: nil)
    OmniAuth.config.test_mode = true
    Rails.application.env_config['omniauth.auth'] = github_auth(user)
    visit root_path
    click_on 'Login with GitHub'
    assert_text "Signed in as #{user.name}"
    visit to if to
  end

  private

  def github_auth(user)
    OmniAuth.config.mock_auth[:github] = OmniAuth::AuthHash.new(
      {
        provider: user.provider,
        uid: user.uid,
        info: {
          email: user.email,
          nickname: user.github_handle,
          first_name: user.name.split.first,
          last_name: user.name.split.last,
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
