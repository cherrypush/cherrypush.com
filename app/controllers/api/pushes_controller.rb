# frozen_string_literal: true

class Api::PushesController < Api::ApplicationController
  include ProjectScoped

  def create
    params[:report] ? create_deprecated : create_new
    render json: { status: :ok }, status: :ok
  end

  private

  # NEW
  # payload = {
  #   project_name: 'cherrypush/cherry-app',
  #   date: '2023-02-07T21:33:15.000Z',
  #   metrics: [
  #     {
  #       name: 'missing coverage',
  #       value: 123, # (opt.) -> if not provided, then it's calculated from occurrences
  #       value_by_owner: { # (opt.)
  #         ditto: 12,
  #         bear: 13,
  #       },
  #       occurrences: [ # (opt.) -> if not provided, then value is mandatory
  #         { name: name, url: url },
  #       ],
  #     },
  #   ],
  # }

  def create_new
    ActiveRecord::Base.transaction do
      params
        .require(:metrics)
        .each do |metric_params|
          metric = Metric.find_or_create_by!(name: metric_params['name'], project: current_project)
          report =
            metric.reports.create!(
              date: params[:date] || Time.current,
              value: metric_params['value'] || metric_params['occurrences'].count,
              value_by_owner: metric_params['value_by_owner'] || value_by_owner(metric_params['occurrences']),
            )
          metric_params['occurrences']&.each do |occurrence| # TODO: optimize to import all at once
            report.occurrences.create!(name: occurrence['name'], url: occurrence['url'])
          end
        end
    end
  end

  # PREVIOUS
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

  def create_deprecated
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

  def value_by_owner(occurrences)
    return nil if occurrences.empty?
    occurrences.map { |occurrence| occurrence['owners'] }.flatten.tally
  end
end
