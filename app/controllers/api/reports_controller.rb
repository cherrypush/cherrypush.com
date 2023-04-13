# frozen_string_literal: true

# TODO: remove once we stop using this endpoint from the CLI
class Api::ReportsController < Api::ApplicationController
  include Api::ProjectScoped

  def last
    render json: nil
  end
end
