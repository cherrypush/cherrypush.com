# frozen_string_literal: true

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2,
           Rails.application.credentials.dig(:google_auth, :client_id),
           Rails.application.credentials.dig(:google_auth, :client_secret)
end

OmniAuth.config.full_host = Rails.env.production? ? 'https://www.cherrypush.com' : 'http://localhost:3001'

# OmniAuth.config.allowed_request_methods = %i[get]
