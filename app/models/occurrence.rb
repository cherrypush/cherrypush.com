# frozen_string_literal: true

class Occurrence < ApplicationRecord
  belongs_to :report

  validates :metric_name, presence: true
  validates :file_path, presence: true
  validates :line_number, presence: true

  def permalink
    "https://github.com/#{report.project.name}/blob/#{report.commit_sha}/#{file_path}#L#{line_number}"
  end
end
