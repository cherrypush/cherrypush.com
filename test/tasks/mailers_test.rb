# frozen_string_literal: true

require 'test_helper'

class MailersTest < ActiveSupport::TestCase
  include ActionMailer::TestHelper

  before { Rails.application.load_tasks }

  it 'delivers emails' do
    user = create(:user)
    project = create(:project, user: user)
    create(:report, commit_date: Time.current, project: project)
    create(:report, commit_date: 4.days.ago, project: project)
    UserMailer.any_instance.expects(:weekly_report).once
    Rake.application.invoke_task 'mailers:deliver_weekly_report'
  end
end
