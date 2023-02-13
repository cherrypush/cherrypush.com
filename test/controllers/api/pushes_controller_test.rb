# frozen_string_literal: true

require 'test_helper'

class Api::PushesControllerTest < ActionDispatch::IntegrationTest
  let!(:user) { create(:user) }

  describe '#create' do
    it 'creates reports' do
      post(api_push_path(api_key: user.api_key), params: new_payload)
      assert_response :ok
      assert_equal ['cherrypush/cherry-app'], Project.all.map(&:name)
      assert_equal ['missing coverage', 'skipped tests'], Metric.all.map(&:name)
      assert_equal [123, 12], Report.all.map(&:value)
      assert_equal 4, Occurrence.count
      assert_includes Occurrence.all.map(&:name), 'test/controllers/application_controller.rb:12'
      assert_includes Occurrence.all.map(&:url).uniq, 'https://github.com/docto2013'
    end

    it 'requires metrics' do
      post(api_push_path(api_key: user.api_key), params: {})
      assert_response :bad_request
      assert_includes response.body, 'param is missing or the value is empty: metrics'
    end

    it 'requires project name' do
      post(api_push_path(api_key: user.api_key), params: { metrics: [] })
      assert_response :bad_request
      assert_includes response.body, 'param is missing or the value is empty: project_name'
    end

    it 'calculates the value from occurrences' do
      post(
        api_push_path(api_key: user.api_key),
        params: {
          project_name: 'rails/rails',
          date: '2023-02-12',
          metrics: [{ name: 'rubocop', occurrences: [{ name: 'filename', url: 'permalink' }] }],
        },
      )
      assert_response :ok
      report = Metric.find_by(name: 'rubocop').reports.last
      assert_equal 1, report.value
      assert_equal '2023-02-12'.to_date, report.date
    end

    it 'assumes default to current date when date param is not provided' do
      post(
        api_push_path(api_key: user.api_key),
        params: {
          project_name: 'rails/rails',
          metrics: [{ name: 'rubocop', occurrences: [{ name: 'filename', url: 'permalink' }] }],
        },
      )
      assert_response :ok
      report = Metric.find_by(name: 'rubocop').reports.last
      assert_equal 1, report.value
      assert_equal Time.current.to_date, report.date.to_date
    end

    it 'assumes value of 1 for occurrences without a value' do
      post(
        api_push_path(api_key: user.api_key),
        params: {
          project_name: 'rails/rails',
          metrics: [{ name: 'rubocop', occurrences: [{ name: 'filename', url: 'permalink' }] }],
        },
      )
      assert_equal 1, Metric.find_by(name: 'rubocop').reports.last.value
    end

    it 'assumes value of 1 for owners of occurrences without a value' do
      post(
        api_push_path(api_key: user.api_key),
        params: {
          project_name: 'rails/rails',
          metrics: [
            {
              name: 'skipped tests',
              occurrences: [
                { name: 'test1', owners: %w[@fwuensche @rchoquet] },
                { name: 'test2', owners: ['@fwuensche'] },
              ],
            },
          ],
        },
      )
      assert_equal 2, Metric.find_by(name: 'skipped tests').reports.last.value
      assert_equal 2, Metric.find_by(name: 'skipped tests').reports.last.value_by_owner['@fwuensche']
      assert_equal 1, Metric.find_by(name: 'skipped tests').reports.last.value_by_owner['@rchoquet']
    end

    it 'calculates value_by_owner from occurrences' do
      post(
        api_push_path(api_key: user.api_key),
        params: {
          project_name: 'rails/rails',
          date: '2023-02-12',
          metrics: [
            {
              name: 'rubocop',
              occurrences: [
                { name: 'test.rb', url: 'permalink', owners: ['@fwuensche'], value: 1.2 },
                { name: 'another_test.rb', url: 'another_permalink', owners: %w[@fwuensche @rchoquet], value: 2.8 },
              ],
            },
          ],
        },
      )
      assert_response :ok
      report = Metric.find_by(name: 'rubocop').reports.last
      assert_equal 2, report.value
      assert_equal({ '@fwuensche' => 4.0, '@rchoquet' => 2.8 }, report.value_by_owner)
      assert_equal 2, Occurrence.count
      assert_equal [1.2, 2.8], Occurrence.all.map(&:value)
    end
  end

  describe '#create_deprecated' do # rubocop:disable Metrics/BlockLength
    it 'creates reports' do
      post(api_push_path(api_key: user.api_key), params: payload)
      assert_response :ok
      assert_equal 2, Metric.count
      assert_equal %w[js_loc react_query_v3], Metric.pluck(:name)
    end

    # TODO: unskip this once we properly manage memberships
    it 'allows the creation of projects for trial users' do
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
      assert_includes response.body, 'param is missing or the value is empty: project_name'
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

  def new_payload
    {
      project_name: 'cherrypush/cherry-app',
      date: '2023-02-07T21:33:15.000Z',
      metrics: [
        {
          name: 'missing coverage',
          value: 123,
          value_by_owner: { # (opt.)
            ditto: 12,
            bear: 13,
          },
        },
        {
          name: 'skipped tests',
          value: 12,
          occurrences: [ # (opt.) -> if not provided, then value is mandatory
            { name: 'test/controllers/application_controller.rb:12', url: 'https://github.com/permalink' },
            { name: 'test/controllers/reports_controller.rb:12', url: 'https://github.com/permalink' },
            { name: 'test/controllers/occurrences_controller.rb:12', url: 'https://github.com/permalink' },
            { name: 'test/controllers/metrics_controller.rb:12', url: 'https://github.com/docto2013' },
          ],
        },
      ],
    }
  end
end
