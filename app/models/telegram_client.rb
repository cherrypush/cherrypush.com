# frozen_string_literal: true

class TelegramClient
  TELEGRAM_TOKEN = ENV.fetch('TELEGRAM_TOKEN', nil)

  class << self
    def send(content)
      return unless Rails.env.production?

      uri = URI.parse("https://api.telegram.org/bot#{TELEGRAM_TOKEN}/sendMessage")

      request = Net::HTTP::Post.new(uri)
      request.content_type = 'application/json'
      request.body = JSON.dump({ 'chat_id' => '-1001230044312', 'text' => content, 'disable_notification' => true })

      req_options = { use_ssl: uri.scheme == 'https' }
      Net::HTTP.start(uri.hostname, uri.port, req_options) { |http| http.request(request) }
    end

    def last_chat_id # rubocop:todo Metrics/MethodLength
      JSON
        .parse(
          Net::HTTP.get(URI.parse("https://api.telegram.org/bot#{TELEGRAM_TOKEN}/getUpdates")),
          object_class: OpenStruct # rubocop:todo Style/OpenStructUse
        )
        .result
        .last
        .message
        .chat
        .id
        .to_s
    end
  end
end
