# frozen_string_literal: true

class User::ChartsController < User::ApplicationController
  def create
    dashboard = Dashboard.find(chart_params[:dashboard_id])

    authorize dashboard.project, :read?

    chart = dashboard.charts.create!(chart_params)
    params[:chart][:metric_ids].each { |metric_id| chart.chart_metrics.create!(metric_id: metric_id) }
  end

  def destroy
    chart = Chart.find(params[:id])
    authorize chart.dashboard.project, :read?
    chart.destroy!
  end

  private

  def chart_params
    params.require(:chart).permit(:dashboard_id)
  end
end
