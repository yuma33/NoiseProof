class User < ApplicationRecord
  authenticates_with_sorcery!

  validates :last_name, length: { maximum: 100 }
  validates :first_name, length: { maximum: 100 }
  validates :name, presence: true,  length: { maximum: 100 }
  validates :email, presence: true, uniqueness: true
  validates :password,  length: { in: 6..20 }, if: -> { new_record? || changes[:crypted_password] }
  validates :password, confirmation: true, if: -> { new_record? || changes[:crypted_password] }
  validates :password_confirmation, presence: true, if: -> { new_record? || changes[:crypted_password] }

  has_many :recordings, dependent: :destroy
  has_many :noise_reports, dependent: :destroy
  has_many :certificates, dependent: :destroy
  has_many :authentications, dependent: :destroy
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :likes_posts, through: :likes, source: :post

  def like(post)
    likes_posts << post
  end

  def unlike(post)
    likes_posts.destroy(post)
  end

  def like?(post)
    likes_posts.include?(post)
  end

  def own?(object)
    self.id == object&.user_id
  end
end
