class AddApiKeyToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :api_key, :string
  end
end
