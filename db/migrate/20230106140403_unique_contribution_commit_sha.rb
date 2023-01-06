class UniqueContributionCommitSha < ActiveRecord::Migration[7.0]
  def change
    add_index :contributions, %i[project_id commit_sha], unique: true
    remove_index :contributions, :commit_sha
  end
end
