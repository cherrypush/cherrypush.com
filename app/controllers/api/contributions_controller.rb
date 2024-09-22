# frozen_string_literal: true

class Api::ContributionsController < Api::ApplicationController
  include Api::ProjectScoped

  def create # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
    ActiveRecord::Base.transaction do
      all_metric_names = params[:contributions].map { |c| c.require('metric_name') }
      metrics = Metric.where(name: all_metric_names, project: current_project)

      params
        .require(:contributions)
        .each do |contribution_params|
          metric = metrics.find { |m| m.name == contribution_params.require('metric_name') }
          next if metric.nil? # if metric is not found, we ignore the contribution

          contribution = metric.contributions.find_or_initialize_by(commit_sha: params[:commit_sha])

          contribution.update!(
            author_name: params[:author_name],
            author_email: params[:author_email],
            commit_date: params[:commit_date],
            diff: contribution_params.require('diff'),
            commit_url: params[:commit_url]
          )

          contribution.notify_watchers!
        end
    end

    render json: { status: :ok }, status: :ok
  end
end
