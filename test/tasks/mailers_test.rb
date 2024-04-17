# frozen_string_literal: true

require 'test_helper'
class MailersTest < ActionMailer::TestCase
  include ActionMailer::TestHelper

  let!(:user) { create(:user) }
  let!(:project) { create(:project, user: user) }
  let!(:metric) { create(:metric, project: project) }

  describe '#deliver_weekly_report' do
    it 'delivers emails' do
      travel_to '2023-01-09 11:00:00' do # monday
        create(:report, date: Time.current, metric: metric)
        create(:report, date: 4.days.ago, metric: metric)
        assert_emails(1) { Rake::Task['mailers:deliver_weekly_report'].execute }
      end
    end

    it 'only delivers weekly report on mondays' do
      travel_to '2023-01-11 11:00:00' do # wednesday
        create(:report, date: Time.current, metric: metric)
        create(:report, date: 4.days.ago, metric: metric)
        assert_emails(0) { Rake::Task['mailers:deliver_weekly_report'].execute }
      end
    end
  end

  describe '#deliver_daily_notifications' do
    let!(:another_user) { create(:user) }
    let!(:notification) { create(:notification, user: user) }

    it 'only sends email to users with unseen notifications' do
      assert_emails(1) { Rake::Task['mailers:deliver_daily_notifications'].execute }
    end
  end
end
