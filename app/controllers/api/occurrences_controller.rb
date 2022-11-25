# frozen_string_literal: true

class Api::OccurrencesController < Api::ApplicationController
  def create
    JSON
      .parse(params.require(:occurrences))
      .map { |occurrence| Occurrence.create!(build_occurrence(occurrence)) }

    render json: { status: :ok }, status: :ok
  rescue StandardError => e
    render json: { status: :error, message: e }, status: :bad_request
  end

  private

  # this simulates strong params
  def build_occurrence(occurrence)
    occurrence.slice(
      "metric_name",
      "commit_sha",
      "file_path",
      "line_number",
      "line_content",
      "repo",
      "owners"
    )
  end
end
