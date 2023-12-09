# frozen_string_literal: true

ActionMailer::Base.smtp_settings = {
  user_name: "f.wuensche@gmail.com",
  password: ENV.fetch("SMTP_PASSWORD", ""),
  address: "smtp-relay.brevo.com",
  port: 587,
  domain: "cherrypush.com",
  authentication: :plain,
  enable_starttls_auto: true,
}
