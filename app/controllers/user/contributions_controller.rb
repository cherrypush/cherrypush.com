# frozen_string_literal: true

class User::ContributionsController < User::ApplicationController
  before_action :set_contributions, only: :index

  def index
    render json:
             @contributions
               .strict_loading
               .includes(metric: :project)
               .order(commit_date: :desc)
               .as_json(include: { metric: { include: :project } })
  end

  private

  def set_contributions
    if params[:metric_id]
      metric = Metric.find(params[:metric_id])
      authorize metric.project, :read?
      @contributions = metric.contributions
    else
      @contributions = current_user.contributions
    end
  end
end
