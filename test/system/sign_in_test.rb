# frozen_string_literal: true

require 'application_system_test_case'

class SignInTest < ApplicationSystemTestCase
  let!(:user) { create(:user, updated_at: 4.months.ago) }

  it 'creates a new account' do
    sign_in(user)
    assert user.reload.updated_at.today?
    click_on 'Avatar'
    find('li', text: 'Sign out').click
    assert_text 'Signed out'
  end
end
