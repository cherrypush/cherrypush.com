# frozen_string_literal: true

class User::ContributionsController < User::ApplicationController
  def index
    @contributions = current_user.contributions.order(commit_date: :desc)
  end
end
