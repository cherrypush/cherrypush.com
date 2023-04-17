# frozen_string_literal: true

def nested_resources(*args, &block)
  resources(*args) { scope module: args.first, &block }
end

def nested_resource(*args, &block)
  resource(*args) { scope module: args.first, &block }
end
