# frozen_string_literal: true

class ProjectsController < ApplicationController
  def index
    @projects = Project.joins(:reports).distinct
  end

  def show
    @project = Project.find(params[:id])
    @occurrences = @project.reports.last.occurrences
    @occurrences = @occurrences.where(metric_name: params[:metric_name]) if params[:metric_name].present?
  end
end
