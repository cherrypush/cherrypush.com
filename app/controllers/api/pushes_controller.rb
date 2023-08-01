# frozen_string_literal: true

class Api::PushesController < Api::ApplicationController
  include Api::ProjectScoped

  def create
    ActiveRecord::Base.transaction do
      params
        .require(:metrics)
        .each do |metric_params|
          metric = Metric.find_or_create_by!(name: metric_params.require('name'), project: current_project)

          report = metric.reports.find_or_initialize_by(uuid: params.require(:uuid))

          report.update!(
            # override date if existing
            date: params[:date] || Time.current,
            # and add to existing values if previous report exists
            value: (report.value || 0) + (metric_params[:value] || get_value(metric_params[:occurrences])),
            value_by_owner:
              report
                .value_by_owner
                .merge(
                  metric_params.permit(value_by_owner: {})[:value_by_owner] ||
                    get_value_by_owner(metric_params[:occurrences]),
                ) { |_key, oldval, newval| oldval + newval },
          )

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
