FactoryBot.define do
  factory :user do
    first_name { "Taro" }
    last_name  { "Yamada" }
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password123" }
    password_confirmation { "password123" }
  end
end
