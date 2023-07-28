require 'application_system_test_case'

class AdminTest < ApplicationSystemTestCase
  let!(:user) { create(:user, name: 'Flavio Wuensche', email: 'f.wuensche@gmail.com', github_handle: 'github_handle') }

  it 'blocks non authenticated users' do
    assert_raises(ActionController::RoutingError) do
      visit '/blazer'
      assert_current_path '/'
    end
  end

  it 'block non admin users' do
    assert_raises(ActionController::RoutingError) do
      sign_in(user, to: '/blazer')
      assert_current_path '/user/projects'
    end
  end

  it 'allows admin users' do
    User.stub_const(:ADMIN_GITHUB_HANDLES, ['github_handle']) do
      sign_in(user, to: '/blazer')
      assert_current_path '/blazer'
      assert_text 'New Query'
    end
  end
end
