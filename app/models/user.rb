# frozen_string_literal: true

class User < ApplicationRecord
  ADMIN_GITHUB_HANDLES = ENV.fetch('ADMIN_GITHUB_HANDLES', '').split(',')

  has_many :owned_projects, class_name: Project.to_s, dependent: :destroy
  has_many :memberships, dependent: :destroy
  has_many :authorizations, dependent: :destroy
  has_many :metrics, through: :projects
  has_many :notifications, dependent: :destroy

  before_save :ensure_api_key

  validates :github_handle, presence: true

  TRIAL_DURATION = 30.days

  def owners
    metrics.map(&:owners).flatten.uniq.sort_by(&:handle)
  end

  def metrics
    Metric.where(project: projects)
  end

  def projects
    return Project.all if admin?
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
    true
    # memberships.any?
  end

  def update_dynamic_attributes(auth)
    self.name = auth.info.name
    self.github_handle = auth.info.nickname
    self.github_organizations = fetch_github_organizations(auth)

    # TODO: maybe we should get all emails from github and let the user choose one for notifications
    # TODO: remember to pick the verified ones, and set the primary as default
    # auth.extra.all_emails.filter(&:verified).map(&:email)
    self.email = auth.info.email if auth.info.email?
    self.image = auth.info.image if auth.info.image?
  end

  def favorited?(resource)
    return resource.id.in?(favorite_project_ids) if resource.is_a?(Project)
    return resource.name.in?(favorite_metric_names) if resource.is_a?(Metric)
    return resource.handle.in?(favorite_owner_handles) if resource.is_a?(Owner)
    false
  end

  def admin?
    github_handle.in? ADMIN_GITHUB_HANDLES
  end

  def contributions
    scope = Contribution.joins(metric: :project).where(metric: { project: projects })
    scope
      .where(author_name: name)
      .or(scope.where(author_email: email))
      .or(scope.where('author_email like ?', "%#{github_handle}%"))
  end

  private

  def ensure_api_key
    self.api_key ||= SecureRandom.uuid
  end

  def fetch_github_organizations(auth)
    return [] unless auth.try(:extra, :raw_info, :organizations_url)

    JSON.parse(
      URI.open(
        auth.extra.raw_info.organizations_url,
        'Accept' => 'application/vnd.github.v3+json',
        'Authorization' => "token #{auth.credentials.token}",
      ).read,
    ).pluck('login')
  end

  class << self
    def find_or_create_with_omniauth(auth)
      user = find_by(auth.slice(:provider, :uid)) || initialize_from_omniauth(auth)
      user.update_dynamic_attributes(auth)
      report_sign_in(user)
      UserMailer.with(user: user).welcome.deliver_now if user.new_record? && user.valid?
      user.save!
      user
    end

    def initialize_from_omniauth(auth)
      new do |user|
        user.provider = auth.provider
        user.uid = auth.uid
      end
    end

    private

    def report_sign_in(user)
      if user.new_record?
        TelegramClient.send("Creating a new user: #{user.name} (#{user.email})")
      else
        TelegramClient.send("Signing in: #{user.name} (#{user.email})")
      end
    end
  end
end
