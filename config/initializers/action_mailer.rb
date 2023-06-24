# frozen_string_literal: true

ActionMailer::Base.smtp_settings = {
  user_name: 'f.wuensche@gmail.com',
  password: Rails.application.credentials.dig(:brevo, :api_key),
  address: 'smtp-relay.sendinblue.com',
  port: 587,
  domain: 'cherrypush.com',
  authentication: :plain,
  enable_starttls_auto: true,
}
