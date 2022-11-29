# frozen_string_literal: true

class ProjectsController < ApplicationController
  def index
    @occurrences_per_project = Occurrence.all.group_by(&:repo)
  end

  def show
    @project = Project.find(params[:id])
    @occurrences = Occurrence.where(repo: @project.name)
    @occurrences = @occurrences.where(metric_name: params[:metric_name]) if params[:metric_name].present?
  end
end
