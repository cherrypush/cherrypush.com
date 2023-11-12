# frozen_string_literal: true

require "test_helper"

class User::AuthorizationsControllerTest < ApplicationIntegrationTest
  let!(:user) { create(:user) }
  let!(:organization) { create :organization, name: "rails", user: user }
  let!(:project) { create :project, user: user, organization: organization }
  let!(:authorization) { create(:authorization, email: user.email, organization: organization) }

  describe "#create" do
    it "requires a paid plan" do
      sign_in(user, controller_test: true)
      post(user_authorizations_path(email: "hello@example.com", organization_id: organization.id), as: :json)
      assert_response :forbidden
      assert_includes response.body, "A paid plan is required to create authorizations."
    end

    it "sends email to the user to whom the authorization has been granted" do
      organization.memberships.create!
      sign_in(user, controller_test: true)
      post(user_authorizations_path(email: "hello@example.com", organization_id: organization.id), as: :json)
      assert_response :success

      assert_enqueued_email_with(
        UserMailer,
        :authorization_granted,
        args: {
          granted_by_user: user,
          authorization: Authorization.last,
        },
      )
    end

    it "notifies admin about new authorizations" do
      organization.memberships.create!
      authorized_user = create :user
      Authorization.create!(email: authorized_user.email, organization: organization)
      sign_in(authorized_user, controller_test: true)
      post(user_authorizations_path(email: "hello@example.com", organization_id: organization.id), as: :json)
      assert_response :success

      assert_enqueued_email_with(
        UserMailer,
        :authorization_alert,
        args: {
          granted_by_user: authorized_user,
          authorization: Authorization.last,
        },
      )
    end

    it "does not notify admin when the admin is the creator of the authorization" do
      organization.memberships.create!
      sign_in(user, controller_test: true)
      post(user_authorizations_path(email: "hello@example.com", organization_id: organization.id), as: :json)
      assert_response :success

      assert_equal 1, ActiveJob::Base.queue_adapter.enqueued_jobs.count
      assert_enqueued_email_with(
        UserMailer,
        :authorization_granted,
        args: {
          granted_by_user: user,
          authorization: Authorization.last,
        },
      )
    end
  end

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
