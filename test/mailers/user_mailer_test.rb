# frozen_string_literal: true

require "test_helper"

class UserMailerTest < ActionMailer::TestCase
  include ActionMailer::TestHelper

  VALUES_BY_OWNER_1 = { ditto: 331 }.freeze
  VALUES_BY_OWNER_2 = { ditto: 341 }.freeze

  let!(:user) { create(:user, name: "Romain Choquet", email: "romain.choquet@example.com") }
  let!(:organization) { create :organization, name: "rails" }
  let!(:project) { create :project, user: user, name: "rails/rails", organization: organization }
  let!(:metric) { create(:metric, name: "JS loc", project: project) }

  it "sends weekly report" do
    travel_to Time.zone.local(2023, 2, 10, 12, 0, 0)
    create(:report, metric: metric, date: Time.current, value: 400, value_by_owner: VALUES_BY_OWNER_1)
    create(:report, metric: metric, date: 8.days.ago, value: 421, value_by_owner: VALUES_BY_OWNER_2)

    email = UserMailer.with(user: user).weekly_report
    assert_emails(1) { email.deliver_now }
    assert_equal email.to, ["romain.choquet@example.com"]
    assert_equal email.from, ["flavio@cherrypush.com"]
    assert_equal email.subject, "Cherry Report: Feb 10, 2023 🍒"
    assert_match "rails/rails", email.body.to_s
    assert_match "JS loc", email.body.to_s
    assert_match "▼ 21", email.body.to_s
  end

  it "sends authorization request" do
    request = AuthorizationRequest.create!(user: user, organization: organization)
    email = UserMailer.with(user: user, authorization_request: request).new_authorization_request
    assert_emails(1) { email.deliver_now }
    assert_equal email.to, ["romain.choquet@example.com"]
    assert_equal email.from, ["flavio@cherrypush.com"]
    assert_equal email.subject, "Cherry - Authorization Request"
    assert_match "Romain Choquet", email.body.to_s
    assert_match "rails", email.body.to_s
  end
end
