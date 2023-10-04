require "application_system_test_case"

class AuthorizationsTest < ApplicationSystemTestCase
  let!(:user) { create :user }
  let!(:regular_user) { create :user }
  let!(:organization) { create :organization, name: "rails", user: user }
  let!(:authorization) { create :authorization, user: regular_user, organization: organization }
  let!(:project) { create :project, user: user, name: "rails/rails", organization: organization }

  it "allows new users to request access to projects from projects" do
    sign_in(regular_user, to: "/user/organizations/#{organization.id}")
    binding.pry
  end
end
