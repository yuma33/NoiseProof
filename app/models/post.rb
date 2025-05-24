class Post < ApplicationRecord
  validates :title, presence: true, length: { maximum: 255 }
  validates :body, presence: true, length: { maximum: 65_535 }

  belongs_to :user
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy

  enum :noise_type, { noise_type_other: 0, footstep: 1, appliance: 2, human_voice: 3,  entertainment: 4, impact: 5, pet: 6, external: 7 }
  enum :frequency, { frequency_other: 0, daily: 1, weekly: 2, few: 3, irregular: 4 }
end
