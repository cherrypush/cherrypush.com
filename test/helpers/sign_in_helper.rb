# frozen_string_literal: true

module SignInHelper
  def sign_in(user = default_user, to: nil, controller_test: false) # rubocop:disable Metrics/MethodLength
    OmniAuth.config.test_mode = true
    Rails.application.env_config["omniauth.auth"] = google_auth(user)
    if controller_test
      get "/auth/google_oauth2/callback"
    else
      visit root_path
      click_on "Login", match: :first
      assert_text "Signed in as #{user.name}"
      to ? visit(to) : refresh
    end
  end

  private

  def google_auth(user)
    OmniAuth.config.mock_auth[:google_oauth2] = OmniAuth::AuthHash.new(
      { provider: user.provider, uid: user.uid, info: info(user), credentials: credentials },
    )
  end

  def info(user)
    {
      email: user.email,
      nickname: user.github_handle,
      first_name: user.name.split.first,
      last_name: user.name.split.last,
      image: "https://avatars.githubusercontent.com/u/1740848?v=4",
    }
  end

  def credentials
    { token: "abcdefgh12345", refresh_token: "12345abcdefgh", expires_at: DateTime.now }
  end

  def default_user
    User.new(
      provider: "github",
      uid: "12345",
      name: "Flavio Wuensche",
      email: "f.wuensche@gmail.com",
      github_handle: "fwuensche",
    )
  end
end
