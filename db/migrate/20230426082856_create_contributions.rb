# frozen_string_literal: true

class CreateContributions < ActiveRecord::Migration[7.0]
  def change
    create_table :contributions do |t|
      t.string :commit_sha, null: false
      t.string :commit_date, null: false
      t.string :author_name, null: false
      t.string :author_email, null: false
      t.integer :diff, null: false
      t.references :metric, null: false, foreign_key: true

      t.timestamps
    end
  end
end
