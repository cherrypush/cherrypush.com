# frozen_string_literal: true

class ProjectsController < ApplicationController
  def index
    @projects = Project.all
  end

  def show
    @project = Project.find(params[:id])
    @occurrences = @project.occurrences
    @occurrences = @occurrences.where(metric_name: params[:metric_name]) if params[:metric_name].present?
  end
end
