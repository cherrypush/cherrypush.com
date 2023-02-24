# frozen_string_literal: true

module AuthorizationsHelper
  def project_autocomplete_items
    current_user.owned_projects.map { |project| { id: project.id, name: project.name } }
  end
end
