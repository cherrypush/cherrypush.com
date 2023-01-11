# frozen_string_literal: true

require 'test_helper'

class UserMailerTest < ActionMailer::TestCase
  include ActionMailer::TestHelper

  METRICS_1 = { 'JS loc' => { owners: { ditto: 331 }, total: 400 } }.freeze
  METRICS_2 = { 'JS loc' => { owners: { ditto: 341 }, total: 421 } }.freeze

  it 'sends weekly report' do
    user = create(:user, email: 'romain.choquet@example.com')
    project = create(:project, user: user, name: 'rails/rails')
    create(:report, commit_date: Time.current, project: project, metrics: METRICS_1)
    create(:report, commit_date: 8.days.ago, project: project, metrics: METRICS_2)
    email = UserMailer.with(user: user).weekly_report
    assert_emails 1 do
      email.deliver_now
    end

    assert_equal email.to, ['romain.choquet@example.com']
    assert_equal email.from, ['flavio@cherrypush.com']
    assert_equal email.subject, 'Weekly Report 🍒'
    assert_match 'rails/rails', email.body.encoded
    assert_match 'JS loc', email.body.encoded
    assert_match '+21', email.body.encoded
  end
end
