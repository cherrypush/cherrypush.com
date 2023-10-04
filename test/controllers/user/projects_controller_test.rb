# frozen_string_literal: true

require "test_helper"

class User::ProjectsControllerTest < ApplicationIntegrationTest
  let!(:isolated_user) { create(:user) }
  let!(:isolated_project) { create(:project, user: isolated_user) }

  describe "#index" do
    it "redirects unauthenticated users to home page" do
      get(user_projects_path, as: :json)
      assert_response :forbidden
    end

    it "returns owned projects" do
      project = create(:project, user: create(:user), name: "rails/rails")

      sign_in(project.user, controller_test: true)
      get(user_projects_path, as: :json)
      assert_equal 1, response.parsed_body.size
      assert_equal ["rails/rails"], response.parsed_body.pluck("name")
      assert_response :ok
    end

    it "returns projects to which you have an authorization" do
      user = create(:user)
      facebook_organization = create(:organization, name: "facebook")
      react_project = create(:project, name: "facebook/react", organization: facebook_organization)
      create(:authorization, user: user, organization: facebook_organization)

      sign_in(user, controller_test: true)
      get(user_projects_path, as: :json)
      assert_equal [react_project.name].sort, response.parsed_body.pluck("name").sort
      assert_response :ok
    end

    it "returns projects to which you have access via SSO" do
      facebook_user = create(:user, email: "mark@facebook.com")
      facebook_organization = create(:organization, name: "facebook", sso_enabled: true, sso_domain: "facebook.com")
      react_project = create(:project, name: "facebook/react", organization: facebook_organization)

      sign_in(facebook_user, controller_test: true)
      get(user_projects_path, as: :json)
      assert_equal [react_project.name].sort, response.parsed_body.pluck("name").sort
      assert_response :ok
    end
  end
end
