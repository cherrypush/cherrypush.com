# frozen_string_literal: true

class User < ApplicationRecord
  has_many :owned_projects, class_name: Project.to_s, dependent: :destroy
  has_many :memberships, dependent: :destroy
  has_many :authorizations, dependent: :destroy
  has_many :reports, through: :owned_projects

  before_save :ensure_api_key

  def projects
    owned_projects.or(Project.where(id: authorizations.select(:project_id)))
  end

  def trial_until
    created_at + 30.days
  end

  def trial_expired?
    !premium? && !trial?
  end

  def trial?
    !premium? && Time.current < trial_until
  end

  def premium?
    memberships.any?
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
