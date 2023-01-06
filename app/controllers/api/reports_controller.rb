# frozen_string_literal: true

# TODO: only for backward compatibility, should be removed after Yan github action has been updated
class Api::ReportsController < Api::ApplicationController
  include ProjectScoped

  def last
    render json: current_project.reports.order(:commit_date).last
  end

  def create
    current_project.reports.create!(report_params)
    render json: { status: :ok }, status: :ok
  end

  private

  def report_params
    params.permit(:commit_sha, :commit_date, metrics: {})
  end
end
