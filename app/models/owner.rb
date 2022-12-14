# frozen_string_literal: true

class Owner
  attr_reader :handle

  def initialize(handle:)
    @handle = handle
  end
end
