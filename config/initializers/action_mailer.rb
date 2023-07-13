# frozen_string_literal: true

if Rails.application.config.action_mailer.perform_deliveries
  ActionMailer::Base.smtp_settings = {
    user_name: 'f.wuensche@gmail.com',
    password: ENV.fetch('BREVO_API_KEY'),
    address: 'smtp-relay.brevo.com',
    port: 587,
    domain: 'cherrypush.com',
    authentication: :plain,
    enable_starttls_auto: true,
  }
end
