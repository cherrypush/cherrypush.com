# frozen_string_literal: true

require 'test_helper'

class User::ProjectsControllerTest < ApplicationIntegrationTest
  let!(:user) { create(:user, name: 'Flavio Wuensche') }
  let!(:project) { create(:project, user: user) }

  describe '#index' do
    it 'redirects unauthenticated users to home page' do
      get(user_projects_path)
      assert_redirected_to root_path
    end

    it 'renders the page' do
      sign_in(user, controller_test: true)
      get(user_projects_path)
      assert_response :ok
    end
  end
end
