# frozen_string_literal: true

require 'test_helper'
class MailersTest < ActionMailer::TestCase
  include ActionMailer::TestHelper

  it 'delivers emails' do
    travel_to '2023-01-09 11:00:00' do # monday
      user = create(:user)
      project = create(:project, user: user)
      metric = create(:metric, project: project)
      create(:report, date: Time.current, metric: metric)
      create(:report, date: 4.days.ago, metric: metric)
      assert_emails(1) { Rake::Task['mailers:deliver_weekly_report'].execute }
    end
  end

  it 'only delivers weekly report on mondays' do
    travel_to '2023-01-11 11:00:00' do # wednesday
      user = create(:user)
      project = create(:project, user: user)
      metric = create(:metric, project: project)
      create(:report, date: Time.current, metric: metric)
      create(:report, date: 4.days.ago, metric: metric)
      assert_emails(0) { Rake::Task['mailers:deliver_weekly_report'].execute }
    end
  end
end
