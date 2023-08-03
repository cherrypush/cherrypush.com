# frozen_string_literal: true

require 'application_system_test_case'

class StaticPagesTest < ApplicationSystemTestCase
  it 'navigates through all pages' do
    visit root_url
    assert_text 'TRY CHERRY FOR FREE'
    click_on 'Terms'
    assert_text 'Terms of Service'
    click_on 'Privacy'
    assert_text 'Privacy Policy'
    click_on 'Docs'
    assert_text 'npm install -g cherrypush'
    click_on 'Demo'
    assert_text 'Login with GitHub to access the demo'
  end
end
