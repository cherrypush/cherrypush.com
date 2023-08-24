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

ActiveRecord::Schema[7.0].define(version: 2023_07_31_220642) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "authorization_requests", force: :cascade do |t|
    t.bigint "project_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_authorization_requests_on_project_id"
    t.index ["user_id"], name: "index_authorization_requests_on_user_id"
  end

  create_table "authorizations", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "project_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_authorizations_on_project_id"
    t.index ["user_id"], name: "index_authorizations_on_user_id"
  end

  create_table "blazer_audits", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "query_id"
    t.text "statement"
    t.string "data_source"
    t.datetime "created_at"
    t.index ["query_id"], name: "index_blazer_audits_on_query_id"
    t.index ["user_id"], name: "index_blazer_audits_on_user_id"
  end

  create_table "blazer_checks", force: :cascade do |t|
    t.bigint "creator_id"
    t.bigint "query_id"
    t.string "state"
    t.string "schedule"
    t.text "emails"
    t.text "slack_channels"
    t.string "check_type"
    t.text "message"
    t.datetime "last_run_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_checks_on_creator_id"
    t.index ["query_id"], name: "index_blazer_checks_on_query_id"
  end

  create_table "blazer_dashboard_queries", force: :cascade do |t|
    t.bigint "dashboard_id"
    t.bigint "query_id"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dashboard_id"], name: "index_blazer_dashboard_queries_on_dashboard_id"
    t.index ["query_id"], name: "index_blazer_dashboard_queries_on_query_id"
  end

  create_table "blazer_dashboards", force: :cascade do |t|
    t.bigint "creator_id"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_dashboards_on_creator_id"
  end

  create_table "blazer_queries", force: :cascade do |t|
    t.bigint "creator_id"
    t.string "name"
    t.text "description"
    t.text "statement"
    t.string "data_source"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_queries_on_creator_id"
  end

  create_table "chart_metrics", force: :cascade do |t|
    t.bigint "chart_id", null: false
    t.bigint "metric_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chart_id"], name: "index_chart_metrics_on_chart_id"
    t.index ["metric_id"], name: "index_chart_metrics_on_metric_id"
  end

  create_table "charts", force: :cascade do |t|
    t.bigint "dashboard_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "kind"
    t.index ["dashboard_id"], name: "index_charts_on_dashboard_id"
  end

  create_table "contributions", force: :cascade do |t|
    t.string "commit_sha", null: false
    t.string "commit_date", null: false
    t.string "author_name", null: false
    t.string "author_email", null: false
    t.integer "diff", null: false
    t.bigint "metric_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["metric_id"], name: "index_contributions_on_metric_id"
  end

  create_table "dashboards", force: :cascade do |t|
    t.string "name"
    t.bigint "project_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_dashboards_on_project_id"
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer "priority", default: 0, null: false
    t.integer "attempts", default: 0, null: false
    t.text "handler", null: false
    t.text "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by"
    t.string "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

  create_table "memberships", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_memberships_on_user_id"
  end

  create_table "metrics", force: :cascade do |t|
    t.string "name"
    t.bigint "project_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "watcher_ids", default: [], array: true
    t.index ["project_id"], name: "index_metrics_on_project_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "item_type", null: false
    t.bigint "item_id", null: false
    t.datetime "seen_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_type", "item_id"], name: "index_notifications_on_item"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "occurrences", force: :cascade do |t|
    t.string "text"
    t.string "url"
    t.bigint "report_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "value"
    t.string "owners", array: true
    t.index ["report_id"], name: "index_occurrences_on_report_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "name"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_projects_on_user_id"
  end

  create_table "reports", force: :cascade do |t|
    t.datetime "date", precision: nil
    t.float "value"
    t.jsonb "value_by_owner", default: {}
    t.bigint "metric_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "uuid"
    t.index ["metric_id"], name: "index_reports_on_metric_id"
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
    t.integer "favorite_metric_ids", default: [], array: true
    t.boolean "weekly_report", default: true
    t.string "github_organizations", default: [], array: true
    t.integer "favorite_dashboard_ids", default: [], array: true
  end

  add_foreign_key "authorization_requests", "projects"
  add_foreign_key "authorization_requests", "users"
  add_foreign_key "authorizations", "projects"
  add_foreign_key "authorizations", "users"
  add_foreign_key "chart_metrics", "charts"
  add_foreign_key "chart_metrics", "metrics"
  add_foreign_key "charts", "dashboards"
  add_foreign_key "contributions", "metrics"
  add_foreign_key "dashboards", "projects"
  add_foreign_key "memberships", "users"
  add_foreign_key "metrics", "projects"
  add_foreign_key "notifications", "users"
  add_foreign_key "occurrences", "reports"
  add_foreign_key "projects", "users"
  add_foreign_key "reports", "metrics"
end
