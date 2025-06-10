class Authentication < ApplicationRecord
  belongs_to :user

  validates :uid, presence: true
  validates :provider, uniqueness: { scope: :uid }
end
