# frozen_string_literal: true

module ProjectScoped
  extend ActiveSupport::Concern

  def current_project
    @current_project ||= @user.projects.find_or_create_by!(name: params['project_name'])
  end
end
