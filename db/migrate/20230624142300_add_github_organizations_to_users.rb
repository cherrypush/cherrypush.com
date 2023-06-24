# frozen_string_literal: true

class AddGithubOrganizationsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :github_organizations, :string, array: true, default: []
  end
end
