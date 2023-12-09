# frozen_string_literal: true

class AdminConstraint
  def self.matches?(request)
    request.session[:user_id] && User.find_by(id: request.session[:user_id])&.admin?
  end
end

def nested_resources(*args, &)
  resources(*args) { scope(module: args.first, &) }
end

def nested_resource(*args, &)
  resource(*args) { scope(module: args.first, &) }
end
