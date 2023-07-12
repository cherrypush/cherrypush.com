# frozen_string_literal: true

class AdminConstraint
  class << self
    def matches?(request)
      user_id = request.env.dig('rack.session', 'user_id')
      User.find_by(id: user_id)&.admin?
    end
  end
end
