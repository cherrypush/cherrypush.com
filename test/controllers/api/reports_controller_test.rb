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
      project = create(:project, name: 'rails/rails', user:)
      create(:report, project:, commit_sha: '11111')
      create(:report, project:, commit_sha: '22222')
      get(last_api_reports_path(api_key: user.api_key, project_name: 'rails/rails'))
      assert_response :ok
      assert_equal '22222', response.parsed_body['commit_sha']
    end
  end

  describe '#create' do
    it 'creates reports' do
      post(api_reports_path(api_key: user.api_key), params: payload)
      assert_response :ok
      assert default_metrics[:js_loc][:total], Report.last.metrics['js_loc']['total']
    end

    it 'creates projects as public by default for non-premium users' do
      user.update!(created_at: 1.month.ago) # so that the trial period is over
      assert_equal false, user.premium?
      post(api_reports_path(api_key: user.api_key), params: payload)
      assert_equal 'public', Project.last.access
    end

    it 'creates projects as private by default for premium users' do
      create(:membership, user:)
      post(api_reports_path(api_key: user.api_key), params: payload)
      assert_equal 'private', Project.last.access
    end

    it 'requires a project name' do
      post(api_reports_path(api_key: user.api_key), params: payload.except(:project_name))
      assert_includes response.body, "Name can't be blank"
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
