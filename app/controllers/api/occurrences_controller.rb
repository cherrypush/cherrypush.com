# frozen_string_literal: true

class Api::OccurrencesController < Api::ApplicationController
  before_action :set_project, only: [:create]

  def create
    report = @project.reports.create!(commit_sha: new_occurrences[0]['commit_sha'])
    new_occurrences.each { |occurrence| report.occurrences.create!(build_occurrence(occurrence)) }

    render json: { status: :ok }, status: :ok
  end

  private

  def build_occurrence(occurrence)
    occurrence.slice('metric_name', 'commit_sha', 'file_path', 'line_number', 'line_content', 'owners')
  end

  def set_project
    # TODO: maybe the repo name should be passed as a param in the root of the request
    @project = @user.projects.find_by(name: new_occurrences[0]['repo'])
    return if @project.present?

    @project = @user.projects.create!(name: new_occurrences[0]['repo'], access: @user.premium? ? 'private' : 'public')
  end

  def new_occurrences
    @new_occurrences ||= JSON.parse(params.require(:occurrences))
  end
end
