# frozen_string_literal: true

class Api::PushesController < Api::ApplicationController
  include ProjectScoped

  # {
  #   'project_name' => 'cherrypush/cherry-app',
  #   'report' => {
  #     'commit_sha' => 'd6a4ee2a42f4b7a97de0190bdc7a82f796dfb479',
  #     'commit_date' => '2023-02-07T21:33:15.000Z',
  #     'metrics' => {
  #       'rubocop' => {
  #         'owners' => {
  #           '@fwuensche' => 1,
  #         },
  #         'total' => 4,
  #       },
  #     },
  #   },
  # }

  def create
    ActiveRecord::Base.transaction do
      params[:report][:metrics].each do |metric_name, metric_data|
        metric = Metric.find_or_create_by!(name: metric_name, project: current_project)
        metric.reports.create!(
          date: params[:report][:commit_date].to_date,
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
