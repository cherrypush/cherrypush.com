# frozen_string_literal: true

class PagesController < ApplicationController
  def home
    redirect_to user_metrics_path if current_user
  end

  def docs
    @content = HTTParty.get('https://raw.githubusercontent.com/cherrypush/cherry-cli/master/README.md').body
  end

  def terms
  end

  def privacy
  end
end
