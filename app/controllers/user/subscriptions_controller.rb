# frozen_string_literal: true

class User::SubscriptionsController < User::ApplicationController
  def create
    redirect_to stripe_session.url, status: 303, allow_other_host: true
  end

  private

  def organization
    @_organization ||= authorize Organization.find(params[:organization_id]), :admin?
  end

  def stripe_session
    @_stripe_session ||=
      Stripe::Checkout::Session.create(
        {
          customer: organization.stripe_customer_id,
          line_items: [{ price: params[:price_id], quantity: 1 }],
          mode: "subscription",
          success_url: user_organization_url(organization),
          cancel_url: user_organization_url(organization),
        },
      )
  end
end
