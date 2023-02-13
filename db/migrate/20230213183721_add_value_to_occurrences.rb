class AddValueToOccurrences < ActiveRecord::Migration[7.0]
  def change
    add_column :occurrences, :value, :float
  end
end
