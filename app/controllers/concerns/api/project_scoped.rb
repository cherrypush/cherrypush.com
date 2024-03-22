# frozen_string_literal: true

module Api::ProjectScoped
  extend ActiveSupport::Concern

  def current_project
    @_current_project ||=
      @user
      .projects
      .find_or_create_by!(name: params.require(:project_name)) do |project|
        project.user = @user
        # project.organization = create_organization if project.organization.nil?
        TelegramClient.send("#{@user.name} just created the project #{project.name}")
      end
  end
end
