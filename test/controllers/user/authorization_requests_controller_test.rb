# frozen_string_literal: true

require "test_helper"

class User::AuthorizationRequestsControllerTest < ApplicationIntegrationTest
  let!(:user) { create(:user) }
  let!(:organization) { create :organization, name: "rails", user: user }
  let!(:project) { create :project, user: user, organization: organization }
  let!(:another_user) { create(:user) }
  let!(:authorization) { create(:authorization, email: another_user.email, organization: organization) }

  describe "#index" do
    it "does not expose user sensitive data" do
      create :authorization_request, user: user, organization: organization
      sign_in(user, controller_test: true)
      get(user_authorization_requests_path, as: :json)
      assert_response :ok
      assert_nil response.parsed_body.first["user"]["api_key"]
    end

    it "only returns authorization requests on organizations your have access to" do
      external_user = create(:user)
      external_organization = create(:organization, user: external_user)
      create :authorization_request, user: external_user, organization: external_organization
      sign_in(user, controller_test: true)
      get(user_authorization_requests_path, as: :json)
      assert_response :ok
      assert_equal [], response.parsed_body
    end
  end

  describe "#create" do
    it "blocks requests if not authenticated" do
      post(user_authorization_requests_path, params: project.id, as: :json)
      assert_response :forbidden
    end

    it "creates contributions" do
      sign_in(user, controller_test: true)

      # it sends an email to all users capable of approving the request
      post(user_authorization_requests_path, params: { project_id: project.id }, as: :json)
      assert_response :ok
      assert_equal 1, AuthorizationRequest.count
      assert 2, ActionMailer::Base.deliveries.size

      # it does not send a second email if the request already exists
      post(user_authorization_requests_path, params: { project_id: project.id }, as: :json)
      assert_equal 1, AuthorizationRequest.count
      assert 2, ActionMailer::Base.deliveries.size
    end
  end
end
