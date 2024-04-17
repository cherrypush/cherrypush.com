# frozen_string_literal: true

class User < ApplicationRecord
  # TODO: add database constraint to avoid duplicate emails and API keys

  ADMIN_EMAILS = ENV.fetch('ADMIN_EMAILS', '').split(',')

  ALL_ATTRIBUTES = User.new.attributes.keys
  DEFAULT_ATTRIBUTES = %w[id name email].freeze

  has_many :owned_projects, class_name: Project.to_s, dependent: :restrict_with_error
  has_many :metrics, through: :projects
  has_many :notifications, dependent: :destroy
  has_many :owned_organizations, class_name: Organization.to_s, dependent: :restrict_with_error
  has_many :views, dependent: :destroy

  before_save :ensure_api_key

  validates :email, presence: true, if: -> { provider == 'google_oauth2' }
  validates :email, uniqueness: true, allow_blank: true # TODO: if we go 100% google oauth, presence is mandatory

  # Ref: https://thoughtbot.com/blog/better-serialization-less-as-json#activemodelserializers-to-the-rescue
  def serializable_hash(options = nil)
    super({ only: DEFAULT_ATTRIBUTES }.merge(options || {}))
  end

  def authorizations
    Authorization.where(email: email)
  end

  def organizations
    return Organization.all if admin?

    Organization.where(
      id: authorizations.pluck(:organization_id) + owned_organizations.pluck(:id) + sso_organizations.ids
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

    owned_projects.or(Project.where(organization_id: organizations.pluck(:id))).or(
      Project.where(name: 'cherrypush/cherry')
    )
  end

  def update_dynamic_attributes(auth) # rubocop:disable Metrics/AbcSize
    raise "Unknown provider: #{auth.provider}" unless auth.provider == 'google_oauth2'

    self.name = "#{auth.info.first_name} #{auth.info.last_name}"
    self.email = auth.info.email if auth.info.email?
    self.image = auth.info.image if auth.info.image?
  end

  def admin?
    email.in? ADMIN_EMAILS
  end

  def contributions
    scope = Contribution.joins(metric: :project).where(metric: { project: projects })
    scope
      .where(author_name: name)
      .or(scope.where(author_email: email))
      .or(scope.where('author_email like ?', "%#{github_handle}%"))
  end

  private

  def sso_organizations
    Organization.where(sso_enabled: true, sso_domain: email.split('@').last)
  end

  def ensure_api_key
    self.api_key ||= SecureRandom.uuid
  end

  class << self
    def find_or_create_with_omniauth(auth)
      user = find_by(email: auth.info.email) || initialize_from_omniauth(auth)
      user.update_dynamic_attributes(auth)
      report_sign_in(user)
      user.save!
      UserMailer.with(user: user).welcome.deliver_later if user.new_record? && user.valid? # TODO: why check valid here?
      user
    end

    private

    def initialize_from_omniauth(auth)
      new do |user|
        user.provider = auth.provider
        user.uid = auth.uid
      end
    end

    def report_sign_in(user)
      if user.new_record?
        TelegramClient.send("Creating a new user: #{user.name} (#{user.email})")
      else
        TelegramClient.send("Signing in: #{user.name} (#{user.email})")
      end
    end
  end
end
