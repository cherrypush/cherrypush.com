# frozen_string_literal: true

module ProjectScoped
  extend ActiveSupport::Concern

  def current_project
    @current_project ||=
      @user
        .projects
        .find_or_create_by!(name: params['project_name']) do |project|
          project.access = @user.premium? || @user.trial? ? 'private' : 'public'
        end
  end
end
