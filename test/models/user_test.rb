require "test_helper"

class UserTest < ActiveSupport::TestCase
  it "does not leak sensitive attributes" do
    user = create :user
    assert user.api_key
    assert_equal User::NON_SENSITIVE_ATTRIBUTES, JSON.parse(user.to_json).keys

    project = create :project, user: user
    assert project.user.api_key
    assert_equal User::NON_SENSITIVE_ATTRIBUTES, JSON.parse(project.to_json(include: :user))["user"].keys
  end

  describe "#projects" do
    let!(:user) { create(:user) }
    let!(:project) { create(:project, user: user) }

    it "includes all projects the user has access to" do
      assert_includes user.projects, project
    end

    it "does not include projects from other users" do
      other_user = create(:user)
      create(:project, user: other_user)
      assert_equal [project], user.projects
    end

    it "returns all projects when the user is an admin" do
      admin = create(:user)
      other_project = create(:project, user: admin)
      admin.stub :admin?, true do
        assert admin.admin?
        assert_equal [project.id, other_project.id], admin.projects.pluck(:id).sort
      end
    end
  end

  describe "with projects" do
    let!(:user) { create(:user) }
    let!(:project) { create(:project, user: user) }

    it "cannot delete user with projects" do
      assert_raise(ActiveRecord::RecordNotDestroyed) { user.destroy! }
    end
  end

  describe "with organizations" do
    let!(:user) { create(:user) }
    let!(:organization) { create(:organization, user: user) }

    it "cannot delete user with organizations" do
      assert_raise(ActiveRecord::RecordNotDestroyed) { user.destroy! }
    end
  end
end
