require "application_system_test_case"

class AuthorizationsTest < ApplicationSystemTestCase
  let!(:user) { create :user }
  let!(:organization) { create :organization, name: "rails", user: user }
  let!(:project) { create :project, user: user, name: "rails/rails", organization: organization }
  let!(:new_user) { create :user, name: "John Doe", github_handle: "jdoe" }
  let!(:dashboard) { create(:dashboard, project: project, name: "TS Migration") }

  it "allows new users to request access to projects from projects" do
    sign_in(new_user, to: user_projects_path(project_id: project.id))
    assert_text "You don't have access to this project"
    click_on "Request Access"
    assert_text "Access request sent" # toast message
    assert_text "Your request has been sent" # text inside the disabled button
    assert_equal new_user.id, AuthorizationRequest.last.user_id
    assert_equal organization.id, AuthorizationRequest.last.organization_id
  end

  it "allows new users to request access to projects from dashboards" do
    sign_in(new_user, to: user_dashboard_path(dashboard))
    assert_text "You don't have access to this project"
    click_on "Request Access"
    assert_text "Access request sent" # toast message
    assert_text "Your request has been sent" # text inside the disabled button
    assert_equal new_user.id, AuthorizationRequest.last.user_id
    assert_equal organization.id, AuthorizationRequest.last.organization_id
  end

  it "allows users to delete authorization" do
    other_user = create :user, name: "Flavio Wuensche"
    create :authorization, user: other_user, organization: organization
    create :authorization, user: new_user, organization: organization

    sign_in(new_user, to: user_authorizations_path)
    assert_text "John Doe"
    assert_text "Flavio Wuensche"
    accept_confirm { all("button", text: "Revoke").first.click }
    assert_text "Authorization revoked"
    assert_no_text "Flavio Wuensche"
    accept_confirm { all("button", text: "Revoke").first.click }
    assert_text "Authorization revoked"
    assert_text "You first need to create a project"
  end

  describe "when the new user requests an authorization" do
    let!(:authorization_request) { create(:authorization_request, organization: organization, user: new_user) }

    it "approves authorizations" do
      sign_in(user, to: user_authorizations_path)
      assert_text "John Doe (@jdoe) requested access to rails organization"
      click_on "Grant access"
      assert_text "A paid plan is required"

      create :membership, organization: organization
      refresh
      click_on "Grant access"
      assert_text "Authorization created"
      assert_equal 1, Authorization.count
      assert_equal new_user.id, Authorization.last.user_id
      assert_equal organization.id, Authorization.last.organization_id
    end

    it "dismisses authorizations" do
      sign_in(user, to: user_authorizations_path)
      assert_text "John Doe (@jdoe) requested access to rails organization"
      click_on "Dismiss"
      assert_text "Authorization request dismissed"
      assert_equal 0, Authorization.count
      assert_equal 0, AuthorizationRequest.count
    end
  end
end
