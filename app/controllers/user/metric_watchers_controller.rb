# frozen_string_literal: true

class User::MetricWatchersController < User::ApplicationController
  def create
    metric = Metric.find(params.require(:metric_id))
    authorize(metric.project, :read_access?)
    metric.watcher_ids << current_user.id
    metric.save!
  end

  def destroy
    metric = Metric.find(params.require(:metric_id))
    authorize(metric.project, :read_access?)
    metric.watcher_ids.delete(current_user.id)
    metric.save!
  end
end
