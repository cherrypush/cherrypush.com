class CreateReports < ActiveRecord::Migration[7.0]
  def change
    create_table :reports do |t|
      t.string :commit_sha
      t.references :project, null: false, foreign_key: true

      t.timestamps
    end
  end
end
