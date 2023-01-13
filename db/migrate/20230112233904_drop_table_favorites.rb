# frozen_string_literal: true

class DropTableFavorites < ActiveRecord::Migration[7.0]
  def change
    drop_table :favorites
  end
end
