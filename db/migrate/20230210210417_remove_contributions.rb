# frozen_string_literal: true

class RemoveContributions < ActiveRecord::Migration[7.0]
  def change
    drop_table :contributions
  end
end
