# frozen_string_literal: true

class User::AuthorizationRequestsController < User::ApplicationController
  def index
    render json: AuthorizationRequest.where(project: current_user.projects).as_json(include: %i[user project])
  end

  def create
    project = Project.find(params[:project_id])
    AuthorizationRequest.create!(project: project, user: current_user)
    head :ok
  end

  def destroy
    authorization = AuthorizationRequest.find(params[:id])
    authorize authorization.project, :read?
    authorization.destroy!
    head :ok
  end
end
