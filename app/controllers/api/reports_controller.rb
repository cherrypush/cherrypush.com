# frozen_string_literal: true

class Api::ReportsController < Api::ApplicationController
  before_action :set_project, only: [:create]

  def create
    @project.reports.create!(report_params)
    render json: { status: :ok }, status: :ok
  end

  private

  def set_project
    @project =
      @user
        .projects
        .find_or_create_by!(name: params['project_name']) do |project|
          project.access = @user.premium? ? 'private' : 'public'
        end
  end

  def report_params
    params.permit(:commit_sha, :commit_date, metrics: {})
  end
end
