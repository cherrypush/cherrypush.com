# frozen_string_literal: true

module AuthorizationsHelper
  def github_handle_autocomplete_items
    User
      .where.not(id: current_user.id)
      .map { |user| { id: user.id, name: user.github_handle } }
      .sort_by { |user| user[:name].downcase }
  end

  def project_autocomplete_items
    current_user.owned_projects.map { |project| { id: project.id, name: project.name } }
  end
end
