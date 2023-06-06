# frozen_string_literal: true

require 'application_system_test_case'

class StaticPagesTest < ApplicationSystemTestCase
  test 'navigates through all pages' do
    visit root_url
    assert_text 'Track and manage your technical debt with ease'
    assert_text 'TRY CHERRY FOR FREE'
    find('a[data-modal-toggle="contact-modal"]').click
    assert_text '@fwuensche'
    click_on 'Close modal'
    click_on 'Terms'
    assert_text 'Terms of Service'
    click_on 'Privacy'
    assert_text 'Privacy Policy'
    click_on 'Docs'
    assert_text 'npm install -g cherrypush'
    click_on 'Demo'
    assert_text 'Please sign in to access the demo'
  end
end
