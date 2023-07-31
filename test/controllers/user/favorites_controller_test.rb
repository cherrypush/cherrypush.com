# frozen_string_literal: true

require 'test_helper'

class User::ArticlesControllerTest < ApplicationIntegrationTest
  let!(:user) { create :user }
  let!(:project) { create :project, user: user }
  let!(:metric) { create :metric, project: project }

  describe '#create' do
    it 'adds metrics to favorites' do
      sign_in(user, controller_test: true)
      assert_equal [], user.favorite_metric_ids
      post(user_favorites_path, params: { id: metric.id, klass: 'Metric' }, as: :json)
      assert_equal [metric.id], user.reload.favorite_metric_ids
      assert_response :ok
    end
  end

  describe '#destroy' do
    it 'removes metrics from favorites' do
      user.favorite_metric_ids << metric.id
      sign_in(user, controller_test: true)
      delete(user_favorites_path, params: { id: metric.id, klass: 'Metric' }, as: :json)
      assert_equal [], user.reload.favorite_metric_ids
      assert_response :ok
    end
  end
end
