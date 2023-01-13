# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_01_12_234120) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "authorizations", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "project_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_authorizations_on_project_id"
    t.index ["user_id"], name: "index_authorizations_on_user_id"
  end

  create_table "contributions", force: :cascade do |t|
    t.datetime "commit_date"
    t.string "author_name"
    t.string "author_email"
    t.string "commit_sha"
    t.jsonb "metrics", null: false
    t.bigint "project_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["commit_date"], name: "index_contributions_on_commit_date"
    t.index ["project_id", "commit_sha"], name: "index_contributions_on_project_id_and_commit_sha", unique: true
    t.index ["project_id"], name: "index_contributions_on_project_id"
  end

  create_table "memberships", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_memberships_on_user_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "name"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_projects_on_user_id"
  end

  create_table "reports", force: :cascade do |t|
    t.string "commit_sha"
    t.bigint "project_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "commit_date", null: false
    t.jsonb "metrics"
    t.index ["project_id"], name: "index_reports_on_project_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "image"
    t.string "provider"
    t.string "uid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "api_key"
    t.string "github_handle"
    t.integer "favorite_project_ids", default: [], array: true
    t.string "favorite_metric_names", default: [], array: true
    t.string "favorite_owner_handles", default: [], array: true
  end

  add_foreign_key "authorizations", "projects"
  add_foreign_key "authorizations", "users"
  add_foreign_key "memberships", "users"
  add_foreign_key "projects", "users"
  add_foreign_key "reports", "projects"
end
