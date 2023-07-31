# frozen_string_literal: true

class Api::PushesController < Api::ApplicationController
  include Api::ProjectScoped
  include Skylight::Helpers

  def create
    ActiveRecord::Base.transaction do
      params
        .require(:metrics)
        .each do |metric_params|
          report =
            Metric
              .find_or_create_by!(name: metric_params.require('name'), project: current_project)
              .reports
              .create!(
                date: params[:date] || Time.current,
                value: metric_params[:value] || get_value(metric_params[:occurrences]),
                value_by_owner: metric_params[:value_by_owner] || get_value_by_owner(metric_params[:occurrences]),
              )

          next if metric_params[:occurrences].blank?

          Skylight.instrument title: 'Occurrence.insert_all' do
            metric_params[:occurrences].each_slice(100) do |occurrences|
              Occurrence.insert_all(
                occurrences.map do |occurrence|
                  occurrence.slice(:url, :value, :owners, :text).merge(report_id: report.id)
                end,
              )
            end
          end
        end
    end

    DatabaseCleanupJob.perform_later(current_project)

    render json: { status: :ok }, status: :ok
  end

  private

  instrument_method
  def get_value(occurrences)
    occurrences.sum { |occurrence| occurrence['value'] || 1 }
  end

  instrument_method
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
