# frozen_string_literal: true

require 'test_helper'

class Api::PushesControllerTest < ActionDispatch::IntegrationTest
  let!(:user) { create(:user) }

  describe '#create' do
    it 'creates reports' do
      post(api_push_path, params: { api_key: user.api_key, **payload }, as: :json)
      assert_response :created
      assert_equal ['cherrypush/cherry-app'], Project.all.map(&:name)
      assert_equal ['missing coverage', 'skipped tests'], Metric.all.map(&:name)
      assert_equal [123, 12], Report.all.map(&:value)
      assert_equal 4, Occurrence.count
      assert_includes Occurrence.all.map(&:text), 'test/controllers/application_controller.rb:12'
      assert_includes Occurrence.all.map(&:url).uniq, 'https://github.com/docto2013'
    end

    it 'requires metrics' do
      post(api_push_path, params: { api_key: user.api_key }, as: :json)
      assert_response :bad_request
      assert_includes response.body, 'param is missing or the value is empty: metrics'
    end

    it 'requires project name' do
      post(
        api_push_path,
        params: {
          api_key: user.api_key,
          uuid: SecureRandom.uuid,
          metrics: [{ name: 'rubocop', occurrences: [{ text: 'filename', url: 'permalink' }] }],
        },
        as: :json,
      )
      assert_response :bad_request
      assert_includes response.body, 'param is missing or the value is empty: project_name'
    end

    it 'calculates the value from occurrences' do
      post(
        api_push_path,
        params: {
          api_key: user.api_key,
          uuid: SecureRandom.uuid,
          project_name: 'rails/rails',
          date: '2023-02-12',
          metrics: [{ name: 'rubocop', occurrences: [{ text: 'filename', url: 'permalink' }] }],
        },
        as: :json,
      )
      assert_response :created
      report = Metric.find_by(name: 'rubocop').reports.last
      assert_equal 1, report.value
      assert_equal '2023-02-12'.to_date, report.date
    end

    it 'assumes default to current date when date param is not provided' do
      post(
        api_push_path,
        params: {
          api_key: user.api_key,
          uuid: SecureRandom.uuid,
          project_name: 'rails/rails',
          metrics: [{ name: 'rubocop', occurrences: [{ text: 'filename', url: 'permalink' }] }],
        },
        as: :json,
      )
      assert_response :created
      report = Metric.find_by(name: 'rubocop').reports.last
      assert_equal 1, report.value
      assert_equal Time.current.to_date, report.date.to_date
    end

    it 'assumes value of 1 for occurrences without a value' do
      post(
        api_push_path,
        params: {
          api_key: user.api_key,
          uuid: SecureRandom.uuid,
          project_name: 'rails/rails',
          metrics: [{ name: 'rubocop', occurrences: [{ text: 'filename', url: 'permalink' }] }],
        },
        as: :json,
      )
      assert_equal 1, Metric.find_by(name: 'rubocop').reports.last.value
    end

    it 'assumes value of 1 for owners of occurrences without a value' do
      post(
        api_push_path,
        params: {
          api_key: user.api_key,
          uuid: SecureRandom.uuid,
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
        as: :json,
      )
      assert_equal 2, Metric.find_by(name: 'skipped tests').reports.last.value
      assert_equal 2, Metric.find_by(name: 'skipped tests').reports.last.value_by_owner['@fwuensche']
      assert_equal 1, Metric.find_by(name: 'skipped tests').reports.last.value_by_owner['@rchoquet']
    end

    it 'calculates value and value_by_owner from occurrences' do
      post(
        api_push_path,
        params: {
          api_key: user.api_key,
          uuid: SecureRandom.uuid,
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
        as: :json,
      )
      assert_response :created
      metric = Metric.find_by(name: 'rubocop')
      report = metric.reports.last

      assert_equal 4, report.value
      assert_equal({ '@fwuensche' => 4.0, '@rchoquet' => 2.8 }, report.value_by_owner)
      assert_equal 2, Occurrence.count
      assert_equal [1.2, 2.8], Occurrence.all.map(&:value)
      assert_equal %w[@fwuensche @rchoquet], Occurrence.last.owners.sort
    end

    it 'adds occurrences to existing report by uuid' do
      post(api_push_path, params: { api_key: user.api_key, **payload }, as: :json)
      assert_equal 4, Report.last.occurrences.count
      post(api_push_path, params: { api_key: user.api_key, **payload }, as: :json)
      assert_equal 8, Report.last.occurrences.count
    end

    it 'adds up value to existing value by uuid' do
      post(api_push_path, params: { api_key: user.api_key, **payload }, as: :json)
      metric_with_value = Metric.find_by(name: 'skipped tests')
      assert_equal 12, metric_with_value.reports.last.value
      post(api_push_path, params: { api_key: user.api_key, **payload }, as: :json)
      assert_equal 24, metric_with_value.reports.last.value
    end

    it 'adds up value_by_owner to existing value_by_owner by uuid' do
      post(api_push_path, params: { api_key: user.api_key, **payload }, as: :json)
      metric_with_owners = Metric.find_by(name: 'missing coverage')
      assert_equal 123, metric_with_owners.reports.last.value
      assert_equal 13, metric_with_owners.reports.last.value_by_owner['bear']
      assert_equal 12, metric_with_owners.reports.last.value_by_owner['ditto']

      post(api_push_path, params: { api_key: user.api_key, **payload }, as: :json)
      assert_equal 246, metric_with_owners.reports.last.value
      assert_equal 26, metric_with_owners.reports.last.value_by_owner['bear']
      assert_equal 24, metric_with_owners.reports.last.value_by_owner['ditto']
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
      repo: repo,
    }
  end

  def payload
    {
      project_name: 'cherrypush/cherry-app',
      date: '2023-02-07T21:33:15.000Z',
      uuid: @uuid ||= SecureRandom.uuid,
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
            { text: 'test/controllers/application_controller.rb:12', url: 'https://github.com/permalink' },
            { text: 'test/controllers/reports_controller.rb:12', url: 'https://github.com/permalink' },
            { text: 'test/controllers/occurrences_controller.rb:12', url: 'https://github.com/permalink' },
            { text: 'test/controllers/metrics_controller.rb:12', url: 'https://github.com/docto2013' },
          ],
        },
      ],
    }
  end
end
