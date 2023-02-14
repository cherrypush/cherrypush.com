# frozen_string_literal: true

class Owner
  attr_accessor :handle, :count

  def initialize(handle:, count: nil)
    @handle = handle
    @count = count
  end

  def hash
    handle.hash
  end

  def eql?(other)
    hash == other.hash
  end
end
