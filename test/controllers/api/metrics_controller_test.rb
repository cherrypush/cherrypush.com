# frozen_string_literal: true

require 'test_helper'

class Api::MetricsControllerTest < ActionDispatch::IntegrationTest
  let!(:user) { create(:user) }
  let!(:project) { create(:project, user: user, name: 'rails/rails') }
  let!(:metric) { create(:metric, project: project, name: 'rubocop') }
  let!(:report) { create(:report, metric: metric, value: 12) }

  describe '#show' do
    it 'returns the value of a metric' do
      get_metric
      assert_response :ok
      assert_equal({ 'value' => 12 }, JSON.parse(response.body))
    end

    it 'raises when project not found' do
      get_metric(project_name: 'unknown/unknown')
      assert_response :not_found
    end

    it 'raises when metric not found' do
      get_metric(metric_name: 'unknown')
      assert_response :not_found
    end

    it 'returns null when metric has no reports' do
      Report.delete_all
      get_metric
      assert_response :ok
      assert_equal({ 'value' => nil }, JSON.parse(response.body))
    end

    it 'raises when api key missing' do
      get_metric(api_key: nil)
      assert_response :bad_request
    end

    it 'handles access control' do
      get_metric(api_key: 'unknown')
      assert_response :unauthorized
    end

    it 'returns the latest value of a metric' do
      _old_report = create(:report, metric: metric, value: 10, date: 1.day.ago)
      _new_report = create(:report, metric: metric, value: 14, date: 1.day.from_now)
      get_metric
      assert_response :ok
      assert_equal({ 'value' => 14 }, JSON.parse(response.body))
    end
  end

  private

  def get_metric(project_name: 'rails/rails', metric_name: 'rubocop', api_key: user.api_key)
    get("/api/metrics?project_name=#{project_name}&metric_name=#{metric_name}&api_key=#{api_key}", as: :json)
  end
end
