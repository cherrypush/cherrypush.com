# frozen_string_literal: true

class PagesController < ApplicationController
  layout 'landing'

  def home; end

  def demo
    if current_user
      redirect_to demo_project_path
    else
      redirect_to root_path, alert: 'Login first to access the demo project.'
    end
  end

  def docs; end

  def terms; end

  def privacy; end

  def pricing; end

  private

  def demo_project_path
    user_projects_path(project_id: Project.find_by(name: 'cherrypush/cherry')&.id)
  end
end
