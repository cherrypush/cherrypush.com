# frozen_string_literal: true

class PagesController < ApplicationController
  def home
    if current_user&.projects&.any?
      redirect_to user_metrics_path
    elsif current_user
      redirect_to user_projects_path
    end
  end

  def docs
    @content = HTTParty.get('https://raw.githubusercontent.com/cherrypush/cherry-cli/master/README.md').body
  end

  def terms
  end

  def privacy
  end

  def pricing
  end
end
