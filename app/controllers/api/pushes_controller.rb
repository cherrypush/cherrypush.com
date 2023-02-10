# frozen_string_literal: true

class Api::PushesController < Api::ApplicationController
  include ProjectScoped

  # ACTUAL
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

  # TARGET
  payload = {
    project_name: 'cherrypush/cherry-app',
    date: '2023-02-07T21:33:15.000Z',
    metrics: [
      {
        name: 'missing coverage',
        value: 123, # (opt.) -> if not provided, then it's calculated from occurrences
        value_by_owner: { # (opt.)
          ditto: 12,
          bear: 13,
        },
        occurrences: [ # (opt.) -> if not provided, then value is mandatory
          { name: name, url: url },
        ],
      },
    ],
  }

  def create
    if params[:report]
      legacy_create
    else
      ActiveRecord::Base.transaction do
        params[:metrics].each do |metric|
          metric = Metric.find_or_create_by!(name: metric['name'], project: current_project)
          report =
            metric.reports.create!(
              date: params[:date].to_date,
              value: metric['value'] || metric['occurrences'].count,
              value_by_owner: metric['value_by_owner'], # TODO: calculate from occurrences
            )
          metric['occurrences'].each do |occurrence| # TODO: optimize to import all at once
            report.occurrences.create!(name: occurrence['name'], url: occurrence['url'])
          end
        end
      end
    end
    render json: { status: :ok }, status: :ok
  end

  private

  def legacy_create
    ActiveRecord::Base.transaction do
      params[:report][:metrics].each do |metric_name, metric_data|
        metric = Metric.find_or_create_by!(name: metric_name, project: current_project)
        metric.reports.create!(
          date: params[:report][:commit_date].to_date,
          value: metric_data['total'],
          value_by_owner: metric_data['owners'],
        )
      end
    end
  end
end
