# frozen_string_literal: true

class Api::OccurrencesController < Api::ApplicationController
  before_action :set_project, only: [:create]

  def create
    # TODO: rethink the mechanism to clean up duplicates for the same repo. this is currently a mess.
    previous_occurrences_ids = @project.occurrences.ids
    new_occurrences.each { |occurrence| @project.occurrences.create!(build_occurrence(occurrence)) }
    Occurrence.where(id: previous_occurrences_ids).destroy_all

    render json: { status: :ok }, status: :ok
  end

  private

  def build_occurrence(occurrence)
    occurrence.slice('metric_name', 'commit_sha', 'file_path', 'line_number', 'line_content', 'owners')
  end

  def set_project
    @project = @user.projects.find_or_create_by!(name: new_occurrences[0]['repo'])
  end

  def new_occurrences
    JSON.parse(params.require(:occurrences))
  end
end
