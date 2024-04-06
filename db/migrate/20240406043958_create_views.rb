# frozen_string_literal: true

class CreateViews < ActiveRecord::Migration[7.0]
  def change
    create_table :views do |t|
      t.references :user, null: false, foreign_key: true
      t.references :viewable, polymorphic: true, null: false

      t.timestamps
    end
  end
end
