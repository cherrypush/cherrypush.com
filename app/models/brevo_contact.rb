# frozen_string_literal: true

class BrevoContact
  class << self
    API_KEY = ENV.fetch("BREVO_API_KEY", "")

    # Sample response:
    # email="f.wuensche@gmail.com", id=1, emailBlacklisted=false, smsBlacklisted=false,
    # createdAt="2023-06-24T17:30:15.961+02:00", modifiedAt="2023-07-18T12:56:19.978+02:00",
    # attributes=#<OpenStruct FIRSTNAME="Flavio", LASTNAME="Wuensche">, listIds=[2, 4], statistics=#<OpenStruct>>
    def get(email)
      call("https://api.brevo.com/v3/contacts/#{email}")
    end

    def create!(first_name:, last_name:, email:) # rubocop:disable Metrics/MethodLength
      call(
        "https://api.brevo.com/v3/contacts",
        method: :post,
        params: {
          attributes: {
            FIRSTNAME: first_name,
            LASTNAME: last_name,
          },
          email: email,
          listIds: [2],
        },
      )
    end

    def update!(email:, first_name: nil, last_name: nil)
      call(
        "https://api.brevo.com/v3/contacts/#{email}",
        method: :put,
        params: {
          attributes: {
            FIRSTNAME: first_name,
            LASTNAME: last_name,
          },
        },
      )
    end

    private

    # TODO: this could be extracted to an isolated class
    def call(url, method: :get, params: nil) # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
      url = URI(url)
      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = true
      request = initialize_request(method, url)
      request["accept"] = "application/json"
      request["content-type"] = "application/json"
      request["api-key"] = API_KEY
      request.body = params.to_json if params.present?

      response = http.request(request)
      raise response.message unless response.code.start_with?("2")
      JSON.parse(response.read_body, object_class: OpenStruct) if response.read_body # rubocop:disable Style/OpenStructUse
    end

    def initialize_request(method, url)
      return Net::HTTP::Get.new(url) if method == :get
      return Net::HTTP::Post.new(url) if method == :post
      return Net::HTTP::Put.new(url) if method == :put
      raise "Unsupported method"
    end
  end
end
