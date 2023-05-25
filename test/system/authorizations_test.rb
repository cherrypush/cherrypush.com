require 'application_system_test_case'

class MetricsTest < ApplicationSystemTestCase
  let!(:user) { create(:user) }
  let!(:project) { create(:project, user: user, name: 'rails/rails') }
  let!(:new_user) { create(:user, name: 'Prabhakar', github_handle: 'prabs') }

  it 'allows new users to request access to projects from projects' do
    sign_in(new_user, to: user_projects_path(project_id: project.id))
    assert_text "You don't have access to this project"
    click_on 'Request Access'
    assert_text 'Access request sent' # toast message
    assert_text 'Your request has been sent' # text inside the disabled button
    assert_equal new_user.id, AuthorizationRequest.last.user_id
    assert_equal project.id, AuthorizationRequest.last.project_id
  end

  it 'allows new users to request access to projects from dashboards' do
    dashboard = create(:dashboard, project: project, name: 'TS Migration')
    sign_in(new_user, to: user_dashboard_path(dashboard))
    assert_text "You don't have access to this project"
    click_on 'Request Access'
    assert_text 'Access request sent' # toast message
    assert_text 'Your request has been sent' # text inside the disabled button
    assert_equal new_user.id, AuthorizationRequest.last.user_id
    assert_equal project.id, AuthorizationRequest.last.project_id
  end

  describe 'when the new user requests an authorization' do
    let!(:authorization_request) { create(:authorization_request, project: project, user: new_user) }

    it 'approves authorizations' do
      sign_in(user, to: user_authorizations_path)
      assert_text 'Prabhakar (@prabs) wants to access rails/rails'
      click_on 'Grant access'
      assert_text 'Authorization created'
      assert_equal 1, Authorization.count
      assert_equal new_user.id, Authorization.last.user_id
      assert_equal project.id, Authorization.last.project_id
    end

    it 'dismisses authorizations' do
      sign_in(user, to: user_authorizations_path)
      assert_text 'Prabhakar (@prabs) wants to access rails/rails'
      click_on 'Dismiss'
      assert_text 'Authorization request dismissed'
      assert_equal 0, Authorization.count
      assert_equal 0, AuthorizationRequest.count
    end
  end
end
