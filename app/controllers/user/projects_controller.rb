# frozen_string_literal: true

class User::ProjectsController < ApplicationController
  def index
    @projects = current_user.projects
  end
end
