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
    occurrence.slice('metric_name', 'file_path', 'line_number', 'line_content', 'owners')
  end

  def set_project
    @project =
      @user
        .projects
        .find_or_create_by!(name: params['project_name']) do |project|
          project.access = @user.premium? ? 'private' : 'public'
        end
  end

  def new_occurrences
    @new_occurrences ||= JSON.parse(params.require(:occurrences))
  end
end
