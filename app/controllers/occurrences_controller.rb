# frozen_string_literal: true

class OccurrencesController < ApplicationController
  def index
    @occurrences = Occurrence.all
  end
end
