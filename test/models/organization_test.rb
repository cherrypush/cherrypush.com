# frozen_string_literal: true

require "test_helper"

class OrganizationTest < ActiveSupport::TestCase
  describe "#users" do
    let!(:owner) { create :user, email: "owner@example.com" }
    let!(:organization) { create(:organization, user: owner) }
    let!(:_unauthorized_user) { create(:user) }

    it "contains the organization owner and authorized users" do
      authorized_user = create(:user)
      create(:authorization, organization: organization, email: authorized_user.email)
      assert_equal 2, organization.users.count
      assert_equal [owner.id, authorized_user.id].sort, organization.users.ids.sort
    end

    describe "when sso enabled" do
      before { organization.update!(sso_enabled: true, sso_domain: "example.com") }

      it "contains sso authorized users" do
        sso_user = create(:user, email: "hello@example.com")
        assert_equal [owner, sso_user], organization.users
      end
    end
  end
end
