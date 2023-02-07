# frozen_string_literal: true

class Api::PushesController < Api::ApplicationController
  include ProjectScoped

  def create
    ActiveRecord::Base.transaction do
      params[:metrics].each do |metric_name, metric_data|
        metric = Metric.find_or_create_by!(name: metric_name, project: current_project)
        metric.reports.create!(
          date: params[:commit_date],
          value: metric_data['total'],
          value_by_owner: metric_data['owners'],
        )
      end

      Contribution.upsert_all(contributions, unique_by: %i[project_id commit_sha]) if contributions.present?
    end
    render json: { status: :ok }, status: :ok
  end

  private

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
