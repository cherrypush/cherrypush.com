# frozen_string_literal: true

class AdminConstraint
  def self.matches?(request)
    request.session[:user_id] && User.find_by(id: request.session[:user_id])&.admin?
  end
end

def nested_resources(*args, &block)
  resources(*args) { scope module: args.first, &block }
end

def nested_resource(*args, &block)
  resource(*args) { scope module: args.first, &block }
end
