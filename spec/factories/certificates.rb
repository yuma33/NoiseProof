FactoryBot.define do
  factory :certificate do
    title { "デフォルト証明書タイトル" }
    user
    certificate_number { SecureRandom.hex(6).upcase }
  end
end
