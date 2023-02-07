# frozen_string_literal: true

# TODO: check with Romain if this is still needed for the CLI
class Api::ReportsController < Api::ApplicationController
  include ProjectScoped

  def last
    render json: current_project.latest_report
  end
end
