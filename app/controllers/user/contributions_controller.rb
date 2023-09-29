# frozen_string_literal: true

class User::ContributionsController < User::ApplicationController
  DEFAULT_LIMIT = 20

  def index
    render json:
             contributions
               .strict_loading
               .includes(metric: :project)
               .limit(DEFAULT_LIMIT)
               .order(commit_date: :desc)
               .as_json(include: { metric: { include: :project } })
  end

  private

  def contributions
    return metric_contributions if params[:metric_id]
    return user_contributions if params[:user_id]

    current_user.contributions
  end

  def metric_contributions
    metric = Metric.find(params[:metric_id])
    authorize(metric.project, :read_access?)
    metric.contributions
  end

  def user_contributions
    User.find(params[:user_id]).contributions.where(metric: Metric.where(project: current_user.projects))
  end
end
