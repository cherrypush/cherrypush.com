# frozen_string_literal: true

class User::ChartsController < User::ApplicationController
  def create
    dashboard = Dashboard.find(chart_params[:dashboard_id])
    authorize dashboard.project, :write_access?
    chart = dashboard.charts.create!(chart_params)
    params[:chart][:metric_ids].each { |metric_id| chart.chart_metrics.create!(metric_id: metric_id) }
  end

  def update
    chart = Chart.find(params[:id])
    authorize chart.dashboard.project, :write_access?
    chart.update!(chart_params)
    update_chart_metrics(chart)
  end

  def destroy
    chart = Chart.find(params[:id])
    authorize chart.dashboard.project, :write_access?
    chart.destroy!
  end

  private

  def chart_params
    params.require(:chart).permit(:dashboard_id, :kind)
  end

  def update_chart_metrics(chart)
    return if chart.chart_metric_ids == params[:chart][:metric_ids]

    chart.chart_metrics.destroy_all
    params[:chart][:metric_ids].each { |metric_id| chart.chart_metrics.create!(metric_id: metric_id) }
  end
end
