# frozen_string_literal: true

class Owner
  attr_reader :handle, :count

  def initialize(handle:, count: nil)
    @handle = handle
    @count = count
  end
end
