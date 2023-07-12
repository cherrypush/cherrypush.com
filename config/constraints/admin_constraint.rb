# frozen_string_literal: true

class AdminConstraint
  def self.matches?(request)
    user_id = request.env['rack.session']['user_id']
    return false if user_id.nil?
    User.find_by(id: user_id)&.admin?
  end
end
