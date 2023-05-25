# frozen_string_literal: true

require 'test_helper'

class User::AuthorizationRequestsControllerTest < ApplicationIntegrationTest
  let!(:user) { create(:user) }
  let!(:project) { create(:project, user: user) }
  let!(:another_user) { create(:user) }
  let!(:authorization) { create(:authorization, user: another_user, project: project) }

  describe '#create' do
    it 'blocks requests if not authenticated' do
      post(user_authorization_requests_path, params: project.id, as: :json)
      assert_redirected_to root_path
    end

    it 'creates contributions' do
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
