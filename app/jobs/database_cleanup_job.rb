# frozen_string_literal: true

class DatabaseCleanupJob < ApplicationJob
  queue_as :default

  def perform(project)
    project.metrics.each(&:clean_up!)
  end
end
