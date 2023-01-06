# frozen_string_literal: true

class User::ContributionsController < User::ApplicationController
  def index
    @contributions = Contribution.where(project: current_user.projects)
    @contributions =
      @contributions
        .where(author_name: current_user.name)
        .or(@contributions.where(author_email: current_user.email))
        .or(@contributions.where('author_email like ?', "%#{current_user.github_handle}%"))
  end
end
