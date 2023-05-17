# frozen_string_literal: true

class User::AuthorizationRequestsController < User::ApplicationController
  def index
    render json: AuthorizationRequest.where(project: current_user.projects).as_json(include: %i[user project])
  end

  def create
    project = Project.find(params[:project_id])
    authorization_request = AuthorizationRequest.find_or_create_by!(project: project, user: current_user)

    # TODO: Move this to a background job. Once we have a background job, we can remove the `if` statement.
    if authorization_request.new_record?
      project.users.each do |user|
        UserMailer.with(user: user, authorization_request: authorization_request).new_authorization_request.deliver_now
      end
    end

    head :ok
  end

  def destroy
    authorization = AuthorizationRequest.find(params[:id])
    authorize authorization.project, :read?
    authorization.destroy!
    head :ok
  end
end
