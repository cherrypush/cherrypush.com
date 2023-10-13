# frozen_string_literal: true

require "application_system_test_case"

class StaticPagesTest < ApplicationSystemTestCase
  let!(:project) { create :project, name: "cherrypush/cherry" }

  it "navigates through all pages" do
    sign_in create(:user)
    visit root_url
    assert_text "TRY CHERRY FOR FREE"
    click_on "Terms"
    assert_text "Terms of Service"
    click_on "Privacy"
    assert_text "Privacy Policy"
    click_on "Docs"
    assert_text "npm install -g cherrypush"
    click_on "Demo"
    assert_text "cherrypush/cherry"
  end
end
