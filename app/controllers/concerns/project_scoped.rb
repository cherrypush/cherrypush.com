# frozen_string_literal: true

module ProjectScoped
  extend ActiveSupport::Concern

  def current_project
    @current_project ||=
      @user
        .projects
        .find_or_create_by!(name: params.require(:project_name)) do |project|
          project.user = @user
          TelegramClient.send("#{@user.name} just created the project #{project.name}")
        end
  end
end
