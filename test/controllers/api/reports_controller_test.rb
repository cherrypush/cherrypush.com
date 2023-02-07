# frozen_string_literal: true

require 'test_helper'

class Api::ReportsControllerTest < ActionDispatch::IntegrationTest
  let!(:user) { create(:user) }

  describe '#last' do
    it 'creates a project if none' do
      assert_equal 0, Project.count
      get(last_api_reports_path(api_key: user.api_key, project_name: 'rails/rails'))
      assert_equal 1, Project.count
      assert_response :ok
      assert_nil response.parsed_body
    end

    it 'returns the most recent report' do
      project = create(:project, name: 'rails/rails', user: user)
      metric = create(:metric, project: project)
      create(:report, metric: metric, date: 1.hours.ago, commit_sha: '22222')
      create(:report, metric: metric, date: 2.hour.ago, commit_sha: '11111')
      get(last_api_reports_path(api_key: user.api_key, project_name: 'rails/rails'))
      assert_response :ok
      assert_equal '22222', response.parsed_body['commit_sha'] # to be reviewed with Romain
    end
  end

  private

  def new_occurrence(repo = 'rails/rails')
    {
      metric_name: 'react_query_v1',
      file_path: 'app/controllers/occurrences_controller.rb',
      line_number: 10,
      line_content: 'class OccurrencesController < ApplicationController',
      owners: ['@fwuensche'],
      repo:,
    }
  end

  def payload(project_name: 'rails/rails')
    { project_name:, commit_sha: '71b1647', commit_date: '2022-10-16 16:00:00', metrics: default_metrics }
  end

  def default_metrics
    { js_loc: { owners: { ditto: 431, pasta: 42 }, total: 473 }, react_query_v3: { owners: {}, total: 23 } }
  end
end
