# frozen_string_literal: true

class AddStripeCustomerIdToOrganizations < ActiveRecord::Migration[7.0]
  def change
    add_column :organizations, :stripe_customer_id, :string
  end
end
