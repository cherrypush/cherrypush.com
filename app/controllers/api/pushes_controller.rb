# frozen_string_literal: true

class Api::PushesController < Api::ApplicationController
  include ProjectScoped

  #   {
  #     project_name: projectName,
  #     report: {
  #       commit_sha: sha,
  #       commit_date: committedAt.toISOString(),
  #       metrics: {
  #         'js_loc' => {
  #           'total' => 100,
  #           'owners' => {
  #             'fwuensche' => 50,
  #           },
  #         },
  #       },
  #     },
  #     contributions:
  #       contributions.map(
  #         (contribution) =>
  #           (
  #             {
  #               author_name: contribution.authorName,
  #               author_email: contribution.authorEmail,
  #               commit_sha: contribution.sha,
  #               commit_date: contribution.date,
  #               metrics: contribution.metrics,
  #             }
  #           ),
  #       ),
  #   }

  def create
    puts params.inspect
    puts params[:report][:commit_date].to_date

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
