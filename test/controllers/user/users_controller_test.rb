# frozen_string_literal: true

require "test_helper"

class User::UsersControllerTest < ApplicationIntegrationTest
  let!(:user) { create(:user, name: "Flavio Wuensche") }
  let!(:project) { create(:project, user: user) }

  describe "#index" do
    it "does not leak user sensitive data" do
      sign_in(user, controller_test: true)
      get(user_users_path, as: :json)
      assert_response :ok
      assert_nil response.parsed_body.first["email"]
      assert_nil response.parsed_body.first["api_key"]
    end
  end
end
