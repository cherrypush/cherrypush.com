# frozen_string_literal: true

class DropViews < ActiveRecord::Migration[7.1]
  def change
    drop_table :views do |t|
      t.references :user, null: false, foreign_key: true
      t.references :viewable, polymorphic: true, null: false
      t.timestamps
    end
  end
end
