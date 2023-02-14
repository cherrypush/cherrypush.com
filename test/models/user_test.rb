require 'test_helper'

class UserTest < ActiveSupport::TestCase
  it 'should not save user without github handle' do
    user = build(:user, github_handle: nil)
    assert_not user.valid?
    assert_includes user.errors[:github_handle], "can't be blank"
  end

  describe '#projects' do
    let!(:user) { create(:user) }
    let!(:project) { create(:project, user: user) }

    it 'includes all projects the user has access to' do
      assert_includes user.projects, project
    end

    it 'does not include projects from other users' do
      other_user = create(:user)
      create(:project, user: other_user)
      assert_equal [project], user.projects
    end

    it 'returns all projects when the user is an admin' do
      admin = create(:user)
      other_project = create(:project, user: admin)
      admin.stub :admin?, true do
        assert admin.admin?
        assert_equal [project.id, other_project.id], admin.projects.pluck(:id).sort
      end
    end
  end
end
