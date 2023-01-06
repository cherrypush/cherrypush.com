class CreateContribution < ActiveRecord::Migration[7.0]
  def change
    create_table :contributions do |t|
      t.datetime :commit_date, index: true
      t.string :author_name
      t.string :author_email
      t.string :commit_sha, index: true, unique: true
      t.jsonb :metrics, null: false
      t.references :project
      t.timestamps
    end
  end
end
