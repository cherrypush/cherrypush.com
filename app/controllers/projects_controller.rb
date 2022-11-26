# frozen_string_literal: true

class ProjectsController < ApplicationController
  def index
    @occurrences_per_project = Occurrence.all.group_by(&:repo)
  end

  def show
    @project = params[:id]
    @occurrences = Occurrence.where(repo: @project)
  end
end
