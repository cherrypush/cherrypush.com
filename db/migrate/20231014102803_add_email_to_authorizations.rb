# frozen_string_literal: true

class AddEmailToAuthorizations < ActiveRecord::Migration[7.0]
  def change
    add_column :authorizations, :email, :string

    # Fill in the email column with the user's email
    Authorization.all.each { |authorization| authorization.update!(email: authorization.user.email) }

    # Add a database constraint to ensure presence
    change_column_null :authorizations, :email, false
  end
end
