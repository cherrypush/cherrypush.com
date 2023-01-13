# frozen_string_literal: true

class AddVisibilityToProjects < ActiveRecord::Migration[7.0]
  def change
    add_column :projects, :access, :string
  end
end
