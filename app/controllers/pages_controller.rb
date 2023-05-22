# frozen_string_literal: true

class PagesController < ApplicationController
  def home
    redirect_to user_projects_path if current_user
  end

  def demo
    if current_user
      redirect_to demo_project_path
    else
      redirect_to root_path, alert: 'Please sign in to access the demo'
    end
  end

  def docs
  end

  def terms
  end

  def privacy
  end

  def pricing
  end

  private

  def demo_project_path
    user_projects_path(project_id: Project.find_by(name: 'demo/project')&.id)
  end
end
