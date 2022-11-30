# frozen_string_literal: true

require 'test_helper'

class OccurrencesControllerTest < ActionDispatch::IntegrationTest
  test 'creates basic occurrences' do
    user = create(:user)
    post(api_occurrences_path(api_key: user.api_key), params: { occurrences: occurrences_json(3) })
    assert_response :ok
    project = Project.find_by!(name: 'rails/rails')
    assert_equal 3, project.occurrences.count
  end

  test 'creates occurrences with owners' do
    user = create(:user)
    post(api_occurrences_path(api_key: user.api_key), params: { occurrences: [new_occurrence].to_json })
    assert_response :ok
    assert_includes Occurrence.first.owners, '@fwuensche'
  end

  test 'cleans previous occurrences of the same project' do
    project = create(:project, name: 'rails/rails')
    user = project.user
    post(api_occurrences_path(api_key: user.api_key), params: { occurrences: [new_occurrence('rails/rails')].to_json })
    assert_equal 1, Occurrence.all.count
    post(api_occurrences_path(api_key: user.api_key), params: { occurrences: [new_occurrence('rails/rails')].to_json })
    assert_equal 1, Occurrence.all.count
    post(api_occurrences_path(api_key: user.api_key), params: { occurrences: [new_occurrence('ruby/ruby')].to_json })
    assert_equal 2, Occurrence.all.count
    assert_equal 1, Project.find_by(name: 'rails/rails').occurrences.count
    assert_equal 1, Project.find_by(name: 'ruby/ruby').occurrences.count
  end

  private

  def new_occurrence(repo = 'rails/rails')
    {
      metric_name: 'react_query_v1',
      commit_sha: '123',
      file_path: 'app/controllers/occurrences_controller.rb',
      line_number: 10,
      line_content: 'class OccurrencesController < ApplicationController',
      owners: ['@fwuensche'],
      repo:,
    }
  end

  def occurrences_json(n)
    n.times.map { new_occurrence }.to_json
  end
end
