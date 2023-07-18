require 'application_system_test_case'

class AdminTest < ApplicationSystemTestCase
  let!(:user) { create(:user, name: 'Flavio Wuensche', email: 'f.wuensche@gmail.com', github_handle: 'github_handle') }

  it 'blocks non authenticated users' do
    visit '/admin'
    assert_current_path '/'

    visit '/blazer'
    assert_current_path '/'
  end

  it 'block non admin users' do
    sign_in(user, to: '/admin')
    assert_current_path '/user/projects'

    visit '/blazer'
    assert_current_path '/user/projects'
  end

  it 'allows admin users' do
    User.stub_const(:ADMIN_GITHUB_HANDLES, ['github_handle']) do
      sign_in(user, to: '/admin')
      assert_current_path '/admin'
      assert_text 'Site Administration'

      visit '/blazer'
      assert_current_path '/blazer'
      assert_text 'New Query'
    end
  end
end
