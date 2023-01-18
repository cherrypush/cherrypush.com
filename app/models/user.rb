# frozen_string_literal: true

class User < ApplicationRecord
  has_many :owned_projects, class_name: Project.to_s, dependent: :destroy
  has_many :memberships, dependent: :destroy
  has_many :authorizations, dependent: :destroy
  has_many :reports, through: :owned_projects

  before_save :ensure_api_key

  TRIAL_DURATION = 30.days

  def contributions
    scope = Contribution.where(project: projects)

    scope
      .where(author_name: name)
      .or(scope.where(author_email: email))
      .or(scope.where('author_email like ?', "%#{github_handle}%"))
  end

  def projects
    owned_projects.or(Project.where(id: authorizations.select(:project_id)))
  end

  def trial_until
    created_at + TRIAL_DURATION
  end

  def trial_expired?
    !premium? && !trial?
  end

  def trial?
    !premium? && Time.current < trial_until
  end

  def premium?
    true # While it's only used at Doctolib
    # memberships.any?
  end

  def self.find_or_create_with_omniauth(auth)
    user = find_by(auth.slice(:provider, :uid)) || initialize_from_omniauth(auth)
    user.update_dynamic_attributes(auth)
    UserMailer.with(user: user).weekly_report.deliver_now if user.new_record?
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

  def favorited?(resource)
    return resource.id.in?(favorite_project_ids) if resource.is_a?(Project)
    return resource.name.in?(favorite_metric_names) if resource.is_a?(Metric)
    return resource.handle.in?(favorite_owner_handles) if resource.is_a?(Owner)
    return false
  end

  private

  def ensure_api_key
    self.api_key ||= SecureRandom.uuid
  end
end
