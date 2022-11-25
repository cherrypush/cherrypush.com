# frozen_string_literal: true

class Occurrence < ApplicationRecord
  validates :metric_name, presence: true
  validates :commit_sha, presence: true
  validates :file_path, presence: true
  validates :line_number, presence: true
  validates :repo, presence: true

  def permalink
    # https://github.com/cherrypush/cherry-app/blob/eced84e0f477ae3d31a84562088c3eee/app/models/occurrence.rb#L11
    "https://github.com/#{repo}/blob/#{commit_sha}/#{file_path}#L#{line_number}"
  end
end
