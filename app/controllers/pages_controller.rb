# frozen_string_literal: true

class PagesController < ApplicationController
  def home
    @content = File.read(Rails.root.join('README.md'))
  end

  def terms
  end

  def privacy
  end
end
