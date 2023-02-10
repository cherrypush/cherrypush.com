# frozen_string_literal: true

require 'test_helper'

class UserMailerTest < ActionMailer::TestCase
  include ActionMailer::TestHelper

  VALUES_BY_OWNER_1 = { ditto: 331 }.freeze
  VALUES_BY_OWNER_2 = { ditto: 341 }.freeze

  it 'sends weekly report' do
    travel_to Time.zone.local(2023, 2, 10, 12, 0, 0)
    user = create(:user, email: 'romain.choquet@example.com')
    project = create(:project, user: user, name: 'rails/rails')
    metric = create(:metric, name: 'JS loc', project: project)
    create(:report, metric: metric, date: Time.current, value: 400, value_by_owner: VALUES_BY_OWNER_1)
    create(:report, metric: metric, date: 8.days.ago, value: 421, value_by_owner: VALUES_BY_OWNER_2)
    email = UserMailer.with(user: user).weekly_report
    assert_emails 1 do
      email.deliver_now
    end

    assert_equal email.to, ['romain.choquet@example.com']
    assert_equal email.from, ['flavio@cherrypush.com']
    assert_equal email.subject, 'Cherry Report: Feb 10, 2023 🍒'
    assert_match 'rails/rails', email.body.encoded
    assert_match 'JS loc', email.body.encoded
    assert_match '▼ 21', email.body.encoded
  end
end
