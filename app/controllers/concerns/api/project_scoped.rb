# frozen_string_literal: true

module Api::ProjectScoped
  extend ActiveSupport::Concern

  def current_project
    return @_current_project if defined?(@_current_project)

    @_current_project = @user.projects.find_or_create_by!(name: params.require(:project_name)) do |project|
      project.user = @user
      TelegramClient.send("#{@user.name} just created the project #{project.name}")
    end
    @_current_project.update!(organization: create_organization) if current_project.organization.nil?
    @_current_project
  end

  private

  def create_organization
    Organization.create!(name: guess_organization_name, user: @user)
  end

  def guess_organization_name
    params[:project_name].split('/').first
  end
end
