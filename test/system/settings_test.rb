# frozen_string_literal: true

require 'application_system_test_case'

class SettingsTest < ApplicationSystemTestCase
  let!(:user) { create(:user) }

  it 'allows users to unsubscribe from weekly reports' do
    sign_in(user, to: user_settings_path)
    fill_in 'GitHub Handle', with: 'yanbonnel'
    uncheck 'Receive a weekly email with your project metrics', visible: false
    click_on 'Save changes'
    assert_text 'Your changes have been saved'
    assert_equal false, user.reload.weekly_report?
    assert_equal 'yanbonnel', user.reload.github_handle
  end
end
