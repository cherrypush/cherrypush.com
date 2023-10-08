# frozen_string_literal: true

class Api::HerokuWebhooksController < Api::ApplicationController
  def create
    raise unless valid_signature?

    puts params[:webhook]
  end

  private

  def valid_signature?
    heroku_hmac && Rack::Utils.secure_compare(calculated_hmac, heroku_hmac)
  end

  def calculated_hmac
    Base64.encode64(
      OpenSSL::HMAC.digest(OpenSSL::Digest.new("sha256"), ENV.fetch("HEROKU_WEBHOOK_SECRET"), request.raw_post),
    ).strip
  end

  def heroku_hmac
    @_heroku_hmac ||= request.headers["Heroku-Webhook-Hmac-SHA256"]
  end
end
