# frozen_string_literal: true

class User < ApplicationRecord
  has_many :projects, dependent: :destroy
  has_many :memberships, dependent: :destroy
  has_many :authorizations, dependent: :destroy
  has_many :reports, through: :projects

  before_save :ensure_api_key

  def trial?
    created_at > 7.days.ago
  end

  def premium?
    return true if trial?
    return true if memberships.any?
    false
  end

  def self.find_or_create_with_omniauth(auth)
    user = find_by(auth.slice(:provider, :uid)) || initialize_from_omniauth(auth)
    user.update_dynamic_attributes(auth)
    user.save!
    user
  end

  def self.initialize_from_omniauth(auth)
    new do |user|
      user.provider = auth.provider
      user.uid = auth.uid
    end
  end

  def update_dynamic_attributes(auth)
    self.name = auth.info.name
    self.github_handle = auth.info.nickname
    self.email = auth.info.email if auth.info.email?
    self.image = auth.info.image if auth.info.image?
  end

  private

  def ensure_api_key
    self.api_key ||= SecureRandom.uuid
  end
end
