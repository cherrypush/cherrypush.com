# frozen_string_literal: true

class User::ContributorsController < User::ApplicationController
  def index
    render json:
             contributions
               .group_by(&:author_name)
               .map { |author_name, contributions| { name: author_name, diff: contributions.sum(&:diff) } }
               .sort_by { |c| c[:diff] }
               .first(5)
  end

  private

  def contributions
    metric = Metric.find(params.require(:metric_id))
    authorize metric.project, :read?
    metric.contributions
  end
end
