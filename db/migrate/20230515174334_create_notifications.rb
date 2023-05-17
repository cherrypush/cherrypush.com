# frozen_string_literal: true

class CreateNotifications < ActiveRecord::Migration[7.0]
  def change
    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true
      t.references :item, polymorphic: true, null: false
      t.timestamp :seen_at

      t.timestamps
    end
  end
end
