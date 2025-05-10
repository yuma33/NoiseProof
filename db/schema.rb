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

ActiveRecord::Schema[7.2].define(version: 2025_05_10_075710) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "certificate_noise_reports", force: :cascade do |t|
    t.bigint "certificate_id", null: false
    t.bigint "noise_report_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["certificate_id", "noise_report_id"], name: "idx_on_certificate_id_noise_report_id_ad025b76ac", unique: true
    t.index ["certificate_id"], name: "index_certificate_noise_reports_on_certificate_id"
    t.index ["noise_report_id"], name: "index_certificate_noise_reports_on_noise_report_id"
  end

  create_table "certificates", force: :cascade do |t|
    t.string "title"
    t.bigint "user_id", null: false
    t.string "certificate_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["certificate_number"], name: "index_certificates_on_certificate_number", unique: true
    t.index ["user_id"], name: "index_certificates_on_user_id"
  end

  create_table "noise_reports", force: :cascade do |t|
    t.bigint "user_id"
    t.string "location"
    t.string "time_period"
    t.integer "frequency", default: 0
    t.integer "noise_type", default: 0
    t.text "memo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "title"
    t.bigint "recording_id", null: false
    t.index ["recording_id"], name: "index_noise_reports_on_recording_id"
    t.index ["user_id"], name: "index_noise_reports_on_user_id"
  end

  create_table "recordings", force: :cascade do |t|
    t.string "title"
    t.text "note"
    t.float "latitude"
    t.float "longitude"
    t.string "location"
    t.datetime "recorded_at"
    t.float "duration"
    t.float "max_decibel"
    t.float "average_decibel"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "db_history"
    t.string "place_id"
    t.index ["user_id"], name: "index_recordings_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "email", null: false
    t.string "crypted_password"
    t.string "salt"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "certificate_noise_reports", "certificates"
  add_foreign_key "certificate_noise_reports", "noise_reports"
  add_foreign_key "certificates", "users"
  add_foreign_key "noise_reports", "recordings"
  add_foreign_key "noise_reports", "users"
  add_foreign_key "recordings", "users"
end
