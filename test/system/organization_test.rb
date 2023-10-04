require "application_system_test_case"

class OrganizationTest < ApplicationSystemTestCase
  let!(:user) { create :user }
  let!(:regular_user) { create :user }
  let!(:organization) { create :organization, name: "rails", user: user }
  let!(:authorization) { create :authorization, user: regular_user, organization: organization }
  let!(:project) { create :project, user: user, name: "rails/rails", organization: organization }

  it "allows regular users to see organization but not edit" do
    sign_in(regular_user, to: "/user/organizations/#{organization.id}")
    assert_text "SSO disabled"
    assert find("#organization_sso_enabled").disabled?
    assert find("button", text: "Update Organization").disabled?
  end

  it "allows admin users to edit organization" do
    sign_in(user, to: "/user/organizations/#{organization.id}")
    click_on "SSO disabled"
    assert_text "SSO enabled"
    fill_in "organization_sso_domain", with: "example.com"
    click_on "Update Organization"
    assert_text "Organization updated"
    assert "example.com", organization.reload.sso_domain
  end
end
