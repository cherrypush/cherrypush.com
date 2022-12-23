# frozen_string_literal: true

class ProjectsController < ApplicationController
  def index
    redirect_to user_metrics_path if current_user
    @projects = Project.public_access.joins(:reports).distinct
  end
end
