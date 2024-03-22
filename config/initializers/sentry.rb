# frozen_string_literal: true

if ENV.fetch('SENTRY_DSN', nil) && Rails.env.production?
  Sentry.init do |config|
    config.dsn = ENV.fetch('SENTRY_DSN')
    config.breadcrumbs_logger = %i[active_support_logger http_logger]
    config.traces_sample_rate = 0.1
    config.profiles_sample_rate = 0.1
    config.excluded_exceptions = [ActionController::RoutingError]
  end
end
