# frozen_string_literal: true

class Api::OccurrencesController < Api::ApplicationController
  def create
    # TODO: rethink the mechanism to clean up duplicates for the same repo. this is currently a mess.
    new_occurrences = JSON.parse(params.require(:occurrences))
    previous_occurrences_ids = Occurrence.where(repo: new_occurrences[0]['repo']).ids
    new_occurrences.map { |occurrence| Occurrence.create!(build_occurrence(occurrence)) }
    Occurrence.where(id: previous_occurrences_ids).destroy_all

    render json: { status: :ok }, status: :ok
  rescue StandardError => e
    render json: { status: :error, message: e }
    raise e
  end

  private

  # this simulates strong params
  def build_occurrence(occurrence)
    occurrence.slice('metric_name', 'commit_sha', 'file_path', 'line_number', 'line_content', 'repo', 'owners')
  end
end
