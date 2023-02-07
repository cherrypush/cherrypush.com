# frozen_string_literal: true

class Api::PushesController < Api::ApplicationController
  include ProjectScoped

  def create
    ActiveRecord::Base.transaction do
      current_project.deprecated_reports.create!(report_params)
      Contribution.upsert_all(contributions, unique_by: %i[project_id commit_sha]) if contributions.present?
    end
    render json: { status: :ok }, status: :ok
  end

  private

  def report_params
    params.require(:report).permit(:commit_sha, :commit_date, metrics: {})
  end

  def contributions
    @contributions ||=
      Array
        .wrap(params[:contributions])
        .map do |contribution_params|
          contribution_params.slice(:author_name, :author_email, :commit_sha, :commit_date, :metrics).merge(
            project_id: current_project.id,
          )
        end
        .select { |contribution_params| contribution_params[:metrics].present? }
  end
end
