FactoryBot.define do
  factory :recording do
    recorded_at { Time.current }
    duration { 10.5 }
    max_decibel { 65.2 }
    average_decibel { 42.0 }
    db_history { [ 37.9, 37.9, 37.9, 37.8, 37.9 ] }  # 例として簡略化
  end
end
