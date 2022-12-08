# frozen_string_literal: true

class Api::ReportsController < Api::ApplicationController
  before_action :set_project, only: [:create]

  def create
    ActiveRecord::Base.transaction do
      report = @project.reports.create!(commit_sha: params['commit_sha'])
      report.occurrences.insert_all(new_occurrences.map { |occurrence| build_occurrence(occurrence) })
    end
    render json: { status: :ok }, status: :ok
  end

  private

  def build_occurrence(occurrence)
    occurrence.slice('metric_name', 'commit_sha', 'file_path', 'line_number', 'line_content', 'owners')
  end

  def set_project
    @project = @user.projects.find_by(name: params['project_name'])
    return if @project.present?

    @project = @user.projects.create!(name: params['project_name'], access: @user.premium? ? 'private' : 'public')
  end

  def new_occurrences
    @new_occurrences ||= JSON.parse(params.require(:occurrences))
  end
end
