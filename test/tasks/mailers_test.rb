# frozen_string_literal: true

require 'test_helper'
class MailersTest < ActionMailer::TestCase
  include ActionMailer::TestHelper

  it 'delivers emails' do
    travel_to '2023-01-09 11:00:00' do # monday
      user = create(:user)
      project = create(:project, user: user)
      create(:report, commit_date: Time.current, project: project)
      create(:report, commit_date: 4.days.ago, project: project)
      assert_emails 1 do
        # Rake.application.invoke_task 'mailers:deliver_weekly_report'
        Rake::Task['mailers:deliver_weekly_report'].execute
      end
    end
  end

  it 'only delivers weekly report on mondays' do
    travel_to '2023-01-11 11:00:00' do # wednesday
      user = create(:user)
      project = create(:project, user: user)
      create(:report, commit_date: Time.current, project: project)
      create(:report, commit_date: 4.days.ago, project: project)
      assert_emails 0 do
        # Rake.application.invoke_task 'mailers:deliver_weekly_report'
        Rake::Task['mailers:deliver_weekly_report'].execute
      end
    end
  end
end
