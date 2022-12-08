# frozen_string_literal: true

class User < ApplicationRecord
  has_many :projects, dependent: :destroy
  has_many :memberships, dependent: :destroy

  before_save :ensure_api_key

  def premium?
    return true if memberships.any?
    false
  end

  def self.find_or_create_with_omniauth(auth)
    user = find_by(auth.slice(:provider, :uid)) || initialize_from_omniauth(auth)
    user.update_dynamic_attributes(auth)
  end

  def self.initialize_from_omniauth(auth)
    new do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.name = auth.info.name
      user.email = auth.info.email
    end
  end

  def update_dynamic_attributes(auth)
    self.image = auth.info.image if auth.info.image?
    save!
    self
  end

  private

  def ensure_api_key
    self.api_key ||= SecureRandom.uuid
  end
end
