# frozen_string_literal: true

class Project
  def self.find(slug)
    OpenStruct.new(occurrences: Occurrence.where(repo: slug), name: slug)
  end
end
