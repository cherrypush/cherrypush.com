# frozen_string_literal: true

require "test_helper"

class User::UsersControllerTest < ApplicationIntegrationTest
  let!(:user) { create(:user, name: "John Doe") }
  let!(:project) { create(:project, user: user) }
  let!(:external_user) { create(:user, email: "external@example.com") }

  describe "#index" do
    it "does not leak user sensitive data" do
      sign_in(user, controller_test: true)
      get(user_users_path, as: :json)
      assert_response :ok
      assert_nil response.parsed_body.first["api_key"]
    end

    it "only returns users from shared organizations" do
      sign_in(user, controller_test: true)
      get(user_users_path, as: :json)
      assert_response :ok
      assert_equal [user.name], response.parsed_body.pluck("name")
    end
  end
end
