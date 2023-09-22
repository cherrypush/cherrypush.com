# frozen_string_literal: true

require "application_system_test_case"

class SettingsTest < ApplicationSystemTestCase
  let!(:user) { create(:user) }

  it "allows users to unsubscribe from weekly reports" do
    sign_in(user, to: user_settings_path)

    uncheck "Receive a weekly email with your project metrics", visible: false
    assert_text "Settings updated"
    assert_equal false, user.reload.weekly_report?
  end
end
