# frozen_string_literal: true

class PagesController < ApplicationController
  def home
  end

  def docs
    # TODO: fetch the docs directly from the GitHub repo
    @content = File.read(Rails.root.join('README.md'))
  end

  def terms
  end

  def privacy
  end
end
