# frozen_string_literal: true

require 'test_helper'

class Api::PushesControllerTest < ActionDispatch::IntegrationTest
  let!(:user) { create(:user) }

  describe '#create' do
    it 'creates reports' do
      post(api_push_path(api_key: user.api_key), params: payload)
      assert_response :ok
      assert_equal 2, Metric.count
      assert_equal %w[js_loc react_query_v3], Metric.pluck(:name)
    end

    # TODO: unskip this once we properly manage memberships
    it 'allow the creation of projects for trial users' do
      skip
      assert_equal false, user.premium?
      assert_equal true, user.trial?
      post(api_push_path(api_key: user.api_key), params: payload)
      assert_equal 1, Project.count
    end

    # TODO: unskip this once we properly manage memberships
    it 'prevents the creation of projects for expired trial users' do
      skip
      user.update!(created_at: Time.current - User::TRIAL_DURATION - 1.day)
      assert_equal false, user.premium?
      assert_equal false, user.trial?
      post(api_push_path(api_key: user.api_key), params: payload)
      assert_equal 0, Project.count
      assert_includes response.body, 'This action requires a premium membership'
    end

    it 'allows the creation of projects for premium users' do
      create(:membership, user:)
      post(api_push_path(api_key: user.api_key), params: payload)
      assert_equal 1, Project.count
    end

    it 'requires a project name' do
      post(api_push_path(api_key: user.api_key), params: payload.except('project_name'))
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
    {
      'project_name' => project_name,
      'report' => {
        'commit_sha' => 'd6a4ee2a42f4b7a97de0190bdc7a82f796dfb479',
        'commit_date' => '2023-02-07T21:33:15.000Z',
        'metrics' => default_metrics,
      },
    }
  end

  def default_metrics
    { js_loc: { owners: { ditto: 431, pasta: 42 }, total: 473 }, react_query_v3: { owners: {}, total: 23 } }
  end
end
