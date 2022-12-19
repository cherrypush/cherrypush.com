# frozen_string_literal: true

class Owner
  attr_accessor :handle, :count

  def initialize(handle:, count: nil)
    @handle = handle
    @count = count
  end
end
