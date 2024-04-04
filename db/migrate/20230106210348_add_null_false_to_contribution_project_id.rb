# frozen_string_literal: true

class AddNullFalseToContributionProjectId < ActiveRecord::Migration[7.0]
  def change
    change_column_null :contributions, :project_id, false
  end
end
