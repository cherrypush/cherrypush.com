# frozen_string_literal: true

class AddGithubHandleToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :github_handle, :string
  end
end
