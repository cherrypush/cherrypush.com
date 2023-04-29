# frozen_string_literal: true

class Api::ContributionsController < Api::ApplicationController
  include Api::ProjectScoped

  def create # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
    ActiveRecord::Base.transaction do
      params
        .require(:contributions)
        .each do |contribution|
          metric = Metric.find_or_create_by!(name: contribution.require('metric_name'), project: current_project)

          metric
            .contributions
            .find_or_initialize_by(commit_sha: params[:commit_sha])
            .update!(
              author_name: params[:author_name],
              author_email: params[:author_email],
              commit_date: params[:commit_date],
              diff: contribution.require('diff'),
            )
        end
    end

    render json: { status: :ok }, status: :ok
  end
end
