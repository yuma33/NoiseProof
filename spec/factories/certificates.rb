FactoryBot.define do
  factory :certificate do
    user
    certificate_number { SecureRandom.hex(6).upcase }
  end
end
