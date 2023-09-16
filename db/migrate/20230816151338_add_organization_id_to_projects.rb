# frozen_string_literal: true

class AddOrganizationIdToProjects < ActiveRecord::Migration[7.0]
  def change
    add_reference :projects, :organization, foreign_key: true
  end
end
