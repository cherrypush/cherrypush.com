# frozen_string_literal: true

require 'application_system_test_case'

class StaticPagesTest < ApplicationSystemTestCase
  let!(:project) { create :project, name: 'cherrypush/cherry' }

  it 'navigates through all pages' do
    visit docs_url
    assert_text 'npm install -g cherrypush'
    sign_in create(:user)
    visit root_url
    assert_text 'START NOW'
    capture_screenshot('home')
    visit terms_url
    assert_text 'Terms of Service'
    visit privacy_url
    assert_text 'Privacy Policy'
    visit docs_url
    assert_text 'npm install -g cherrypush'
    click_on 'Demo'
    assert_text 'cherrypush/cherry'
  end
end
