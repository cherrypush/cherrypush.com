# frozen_string_literal: true

class Api::PushesController < Api::ApplicationController
  include ProjectScoped

  def create
    ActiveRecord::Base.transaction do
      current_project.reports.create!(report_params)
      contributions.each { |contribution| current_project.contributions.build(contribution) }
      current_project.save!
    end
    render json: { status: :ok }, status: :ok
  end

  private

  def report_params
    params.require(:report).permit(:commit_sha, :commit_date, metrics: {})
  end

  def contributions
    Array
      .wrap(params[:contributions])
      .map do |contribution_params|
        contribution_params.permit(:author_name, :author_email, :commit_sha, :commit_date, metrics: {})
      end
      .select { |contribution_params| contribution_params[:metrics].present? }
  end
end
