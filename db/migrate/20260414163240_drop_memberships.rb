class DropMemberships < ActiveRecord::Migration[7.1]
  def change
    drop_table :memberships do |t|
      t.string :kind
      t.bigint :organization_id, null: false
      t.timestamps
    end
  end
end
