# frozen_string_literal: true

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github,
           Rails.application.credentials.dig(Rails.env.to_sym, :github, :client_id),
           Rails.application.credentials.dig(Rails.env.to_sym, :github, :client_secret),
           scope: 'user:email,read:org'
end
