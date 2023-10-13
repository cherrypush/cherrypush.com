# frozen_string_literal: true

stripe_api_key = ENV.fetch("STRIPE_SECRET_KEY", nil)

Stripe.api_key = stripe_api_key if stripe_api_key.present?
