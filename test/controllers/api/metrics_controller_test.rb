# frozen_string_literal: true

require 'test_helper'

class Api::PushesControllerTest < ActionDispatch::IntegrationTest
  let!(:user) { create(:user) }
  let!(:project) { create(:project, name: 'rails/rails', user: user) }
  let!(:metric) { create(:metric, name: 'rubocop', project: project) }
  let!(:report) { create(:report, metric: metric, value: 12) }

  describe '#show' do
    it 'returns the latest value' do
      get(api_metric_path(metric_name: 'rubocop', project_name: 'rails/rails', api_key: user.api_key), as: :json)
      assert_response :ok
      assert_equal({ 'value' => 12.0 }, response.parsed_body)
    end

    it 'raises when metric does not exist' do
      get(api_metric_path(metric_name: 'rubocopo', project_name: 'rails/rails', api_key: user.api_key), as: :json)
      assert_response :not_found
    end

    it 'requires an api key' do
      get(api_metric_path(metric_name: 'rubocop', project_name: 'rails/rails'), as: :json)
      assert_response :bad_request
    end

    it 'handles access control' do
      get(api_metric_path(metric_name: 'rubocop', project_name: 'rails/rails', api_key: '12901290812'), as: :json)
      assert_response :unauthorized
    end

    it 'raises if no reports' do
      report.destroy
      get(api_metric_path(metric_name: 'rubocop', project_name: 'rails/rails', api_key: user.api_key), as: :json)
      assert_response :not_found
    end
  end

  private

  def payload
    { project_name: 'cherrypush/cherry-app', metric_name: 'missing coverage' }
  end
end
