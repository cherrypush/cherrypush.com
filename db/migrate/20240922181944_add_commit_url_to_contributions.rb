# frozen_string_literal: true

class AddCommitUrlToContributions < ActiveRecord::Migration[7.1]
  def change
    add_column :contributions, :commit_url, :string
  end
end
