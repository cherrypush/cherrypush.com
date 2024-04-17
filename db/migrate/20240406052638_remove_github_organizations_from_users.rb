# frozen_string_literal: true

class RemoveGithubOrganizationsFromUsers < ActiveRecord::Migration[7.0]
  def change
    remove_column :users, :github_organizations
  end
end
