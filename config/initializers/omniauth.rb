# frozen_string_literal: true

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github, ENV.fetch('GITHUB_CLIENT_ID'), ENV.fetch('GITHUB_CLIENT_SECRET'), scope: 'user:email,read:org'
end
