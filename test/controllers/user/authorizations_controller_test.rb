# frozen_string_literal: true

require "test_helper"

class User::AuthorizationsControllerTest < ApplicationIntegrationTest
  let!(:user) { create(:user) }
  let!(:organization) { create :organization, name: "rails", user: user }
  let!(:project) { create :project, user: user, organization: organization }
  let!(:authorization) { create(:authorization, user: user, organization: organization) }

  describe "#destroy" do
    it "blocks requests if not authenticated" do
      delete(user_authorization_path(authorization), as: :json)
      assert_response :forbidden
    end

    it "does not allow users to delete authorizations in another organization" do
      another_user = create :user
      sign_in(another_user, controller_test: true)
      delete(user_authorization_path(authorization), as: :json)
      assert_response :forbidden
    end

    it "deletes authorizations inside own organization" do
      sign_in(user, controller_test: true)
      delete(user_authorization_path(authorization), as: :json)
      assert_response :no_content
      assert_nil Authorization.last
    end
  end
end
