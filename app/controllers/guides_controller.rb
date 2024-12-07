# frozen_string_literal: true

class GuidesController < ApplicationController
  layout 'landing'

  def index
    @guides = Guide.all
  end

  def show
    @guide = Guide.find(params[:id])
    redirect_to guides_path unless @guide
  end
end
