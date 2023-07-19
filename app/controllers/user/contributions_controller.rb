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
    if params[:metric_id]
      metric = Metric.find(params[:metric_id])
      authorize metric.project, :read?
      metric.contributions
    elsif params[:user_id]
      # only contributions to projects current user has access to
      User.find(params[:user_id]).contributions.where(metric: Metric.where(project: current_user.projects))
    else
      current_user.contributions
    end
  end
end
