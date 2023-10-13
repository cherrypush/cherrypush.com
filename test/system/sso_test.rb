require "application_system_test_case"

class SsoTest < ApplicationSystemTestCase
  let!(:user) { create :user, name: "Mark", email: "mark@facebook.com" }
  let!(:organization) do
    create :organization, name: "facebook", user: user, sso_enabled: true, sso_domain: "facebook.com"
  end
  let!(:project) { create :project, user: user, name: "facebook/react", organization: organization }
  let!(:internal_facebook_user) { create :user, email: "rafa@facebook.com", name: "Rafael França" }

  let!(:rails_organization) { create :organization, name: "rails", user: create(:user, name: "DHH") }
  let!(:rails_project) { create :project, name: "rails/rails", organization: rails_organization }
  let!(:authorization) { create :authorization, user: internal_facebook_user, organization: rails_organization }

  it "allows users to see all organizations they have access to" do
    sign_in(internal_facebook_user, to: user_authorizations_path(project_id: project.id))
    assert_text "facebook projects"
    assert_text "Mark"
    assert_text "rails projects"
    assert_text "DHH"
    assert_text "Rafael França"
    # TODO: users should be able to see other users who have access to the organization
  end
end
