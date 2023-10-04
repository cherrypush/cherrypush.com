# frozen_string_literal: true

class User < ApplicationRecord
  ADMIN_GITHUB_HANDLES = ENV.fetch("ADMIN_GITHUB_HANDLES", "").split(",")

  ALL_ATTRIBUTES = User.new.attributes.keys
  NON_SENSITIVE_ATTRIBUTES = %w[id name github_handle]

  has_many :owned_projects, class_name: Project.to_s, dependent: :destroy
  has_many :authorizations, dependent: :destroy
  has_many :metrics, through: :projects
  has_many :notifications, dependent: :destroy
  has_many :owned_organizations, class_name: Organization.to_s, dependent: :destroy

  before_save :ensure_api_key

  validates :github_handle, presence: true, if: -> { provider == "github" }
  validates :email, presence: true, if: -> { provider == "google_oauth2" }
  validates :email, uniqueness: true, allow_blank: true # TODO: if we go 100% google oauth, presence is mandatory

  # Ref: https://thoughtbot.com/blog/better-serialization-less-as-json#activemodelserializers-to-the-rescue
  def serializable_hash(options = nil)
    super({ only: NON_SENSITIVE_ATTRIBUTES }.merge(options || {}))
  end

  def organizations
    return Organization.all if admin?
    Organization.where(
      id: authorizations.pluck(:organization_id) + owned_organizations.pluck(:id) + sso_organizations.ids,
    )
  end

  def owners
    metrics.map(&:owners).flatten.uniq.sort_by(&:handle)
  end

  def metrics
    Metric.where(project: projects)
  end

  def projects
    return Project.all if admin?
    owned_projects.or(Project.where(organization_id: organizations.pluck(:id)))
  end

  def update_dynamic_attributes(auth) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
    if auth.provider == "google_oauth2"
      self.name = "#{auth.info.first_name} #{auth.info.last_name}"
    elsif auth.provider == "github"
      self.name = auth.info.name
      self.github_handle = auth.info.nickname
      self.github_organizations = fetch_github_organizations(auth)
    else
      raise "Unknown provider: #{auth.provider}"
    end

    # TODO: maybe we should get all emails from github and let the user choose one for notifications
    # TODO: remember to pick the verified ones, and set the primary as default
    # auth.extra.all_emails.filter(&:verified).map(&:email)
    self.email = auth.info.email if auth.info.email?
    self.image = auth.info.image if auth.info.image?
  end

  def admin?
    github_handle.in? ADMIN_GITHUB_HANDLES
  end

  def contributions
    scope = Contribution.joins(metric: :project).where(metric: { project: projects })
    scope
      .where(author_name: name)
      .or(scope.where(author_email: email))
      .or(scope.where("author_email like ?", "%#{github_handle}%"))
  end

  private

  def sso_organizations
    Organization.where(sso_enabled: true, sso_domain: email.split("@").last)
  end

  def ensure_api_key
    self.api_key ||= SecureRandom.uuid
  end

  def fetch_github_organizations(auth)
    return [] unless auth.try(:extra, :raw_info, :organizations_url)

    # organizations_url has the shape of https://api.github.com/users/:github_handle/orgs
    HTTParty.get(auth.extra.raw_info.organizations_url).pluck("login")
  end

  class << self
    def find_or_create_with_omniauth(auth)
      user = find_by(email: auth.info.email) || find_by(auth.slice(:provider, :uid)) || initialize_from_omniauth(auth)
      user.update_dynamic_attributes(auth)
      report_sign_in(user)
      user.save!
      UserMailer.with(user: user).welcome.deliver_later if user.new_record? && user.valid? # TODO: why check valid here?
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
