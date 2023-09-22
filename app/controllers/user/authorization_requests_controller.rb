# frozen_string_literal: true

class User::AuthorizationRequestsController < User::ApplicationController
  def index
    render json:
             AuthorizationRequest.where(organization: current_user.organizations).as_json(
               include: %i[user organization],
             )
  end

  def create
    authorization_request = AuthorizationRequest.find_or_create_by!(organization: organization, user: current_user)

    # TODO: Move this to a background job. Once we have a background job, we can remove the `if` statement.
    if authorization_request.previously_new_record?
      organization.users.each do |user|
        UserMailer
          .with(user: user, authorization_request: authorization_request)
          .new_authorization_request
          .deliver_later
      end
    end

    head :ok
  end

  def destroy
    authorization = AuthorizationRequest.find(params[:id])
    authorize authorization.organization, :read?
    authorization.destroy!
    head :ok
  end

  private

  def organization
    if params[:project_id]
      project = Project.find(params[:project_id])
      project.organization
    elsif params[:organization_id]
      Organization.find(params[:organization_id])
    else
      raise "Must provide either project_id or organization_id"
    end
  end
end
