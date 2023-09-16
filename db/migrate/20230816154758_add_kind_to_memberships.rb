# frozen_string_literal: true

class AddKindToMemberships < ActiveRecord::Migration[7.0]
  def change
    add_column :memberships, :kind, :string
  end
end
