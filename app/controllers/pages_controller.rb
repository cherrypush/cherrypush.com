# frozen_string_literal: true

class PagesController < ApplicationController
  def home
  end

  def docs
    @content = HTTParty.get('https://raw.githubusercontent.com/cherrypush/cherry-cli/master/README.md').body
  end

  def terms
  end

  def privacy
  end
end
