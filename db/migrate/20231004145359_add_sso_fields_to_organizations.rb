# frozen_string_literal: true

class AddSsoFieldsToOrganizations < ActiveRecord::Migration[7.0]
  def change
    add_column :organizations, :sso_domain, :string
    add_column :organizations, :sso_enabled, :boolean, default: false, null: false
  end
end
