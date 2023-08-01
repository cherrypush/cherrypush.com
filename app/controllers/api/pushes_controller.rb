# frozen_string_literal: true

class Api::PushesController < Api::ApplicationController
  include Api::ProjectScoped

  def create
    ActiveRecord::Base.transaction do
      params
        .require(:metrics)
        .each do |metric_params|
          metric = Metric.find_or_create_by!(name: metric_params.require('name'), project: current_project)

          report =
            metric
              .reports
              .find_or_initialize_by(uuid: params.require(:uuid)) do |current_report|
                current_report.update!(
                  date: params[:date] || Time.current,
                  value: metric_params[:value] || get_value(metric_params[:occurrences]),
                  value_by_owner: metric_params[:value_by_owner] || get_value_by_owner(metric_params[:occurrences]),
                )
              end

          next if metric_params[:occurrences].blank?

          Occurrence.insert_all(
            metric_params[:occurrences].map do |occurrence|
              occurrence.slice(:url, :value, :owners, :text).merge(report_id: report.id)
            end,
          )
        end
    end

    # delete previous reports in the same day for the same metric
    DatabaseCleanupJob.perform_later(current_project) if params[:cleanup] == true

    render json: { status: :ok }, status: :created
  end

  private

  def get_value(occurrences)
    occurrences.sum { |occurrence| occurrence['value'] || 1 }
  end

  def get_value_by_owner(occurrences)
    return {} if occurrences.empty?

    occurrences.each_with_object({}) do |occurrence, owners|
      Array
        .wrap(occurrence['owners'])
        .each do |owner|
          owners[owner] ||= 0
          owners[owner] += (occurrence['value'] || 1).to_f
        end
    end
  end
end
