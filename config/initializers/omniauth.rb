# frozen_string_literal: true

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2,
           Rails.application.credentials.dig(:google_auth, :client_id),
           Rails.application.credentials.dig(:google_auth, :client_secret)
end

# This is to work around the fact that Google does not allow 0.0.0.0 as redirect URL
OmniAuth.config.full_host = Rails.env.production? ? 'https://www.cherrypush.com' : 'http://localhost:3001'

OmniAuth.config.allowed_request_methods = %i[get]
