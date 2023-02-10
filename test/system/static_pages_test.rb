require 'application_system_test_case'

class StaticPagesTest < ApplicationSystemTestCase
  test 'visiting the index' do
    visit root_url
    assert_text 'Track and manage your technical debt with ease'
    click_on 'Shoot us a message'
    assert_text '@fwuensche'
    click_on 'Close modal'
    click_on 'Terms'
    assert_text 'Terms of Service'
    click_on 'Privacy'
    assert_text 'Privacy Policy'
    click_on 'Docs'
    assert_text 'npm install -g cherrypush'
    click_on 'Demo'
    assert_text 'Sign in to GitHub'
  end
end
