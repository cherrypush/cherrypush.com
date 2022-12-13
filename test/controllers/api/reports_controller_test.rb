# frozen_string_literal: true

require 'test_helper'

class Api::ReportsControllerTest < ActionDispatch::IntegrationTest
  let!(:user) { create(:user) }

  it 'creates basic occurrences' do
    post(api_reports_path(api_key: user.api_key), params: report_params(number_of_occurrences: 3))
    assert_response :ok
    project = Project.find_by!(name: 'rails/rails')
    assert_equal 3, project.reports.last.occurrences.count
  end

  it 'creates occurrences with owners' do
    post(api_reports_path(api_key: user.api_key), params: report_params)
    assert_response :ok
    assert_includes Occurrence.first.owners, '@fwuensche'
  end

  it 'keeps previous occurrences of the same project in a separate report' do
    create(:project, name: 'rails/rails', user:)
    post(api_reports_path(api_key: user.api_key), params: report_params(project_name: 'rails/rails'))
    assert_equal 1, Report.last.occurrences.count
    post(api_reports_path(api_key: user.api_key), params: report_params(project_name: 'rails/rails'))
    assert_equal 1, Report.last.occurrences.count
    post(api_reports_path(api_key: user.api_key), params: report_params(project_name: 'ruby/ruby'))
    assert_equal 3, Report.count
    assert_equal 2, Project.find_by(name: 'rails/rails').reports.count
    assert_equal 1, Project.find_by(name: 'ruby/ruby').reports.count
  end

  it 'creates projects as public by default for non-premium users' do
    post(api_reports_path(api_key: user.api_key), params: report_params)
    assert_equal 'public', Project.last.access
  end

  it 'creates projects as private by default for premium users' do
    create(:membership, user:)
    post(api_reports_path(api_key: user.api_key), params: report_params)
    assert_equal 'private', Project.last.access
  end

  it 'requires a project name' do
    post(api_reports_path(api_key: user.api_key), params: report_params.except(:project_name))
    assert_includes response.body, "Name can't be blank"
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

  def report_params(number_of_occurrences: 1, project_name: 'rails/rails')
    {
      project_name:,
      commit_sha: '123',
      commit_date: '2022-10-16 16:00:00',
      occurrences: number_of_occurrences.times.map { new_occurrence }.to_json,
    }
  end
end
