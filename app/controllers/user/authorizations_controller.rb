# frozen_string_literal: true

class User::AuthorizationsController < User::ApplicationController
  def index
    @authorizations = Authorization.where(project: current_user.projects)
  end

  def new
    @authorization = Authorization.new
  end

  def create
    project = current_user.projects.find(params[:project_id])
    user = User.find_by(email: params[:email])
    return redirect_to user_authorizations_path, alert: 'User not found' if user.blank?
    return redirect_to user_authorizations_path, alert: 'Project not found' if project.blank?

    authorization = Authorization.new(project: project, user: user)
    if authorization.save
      redirect_to user_authorizations_path, notice: 'Authorization created'
    else
      render :new
    end
  end

  def destroy
    current_user.authorizations.find(params[:id]).destroy!
    redirect_to user_authorizations_path, notice: 'Authorization removed'
  end
end
