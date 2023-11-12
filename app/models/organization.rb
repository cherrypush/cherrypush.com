# frozen_string_literal: true

class Organization < ApplicationRecord
  EMAIL_PROVIDERS = %w[gmail.com yahoo.com hotmail.com outlook.com aol.com icloud.com].freeze

  belongs_to :user

  has_many :memberships
  has_many :projects
  has_many :authorizations, dependent: :destroy

  # TODO: there should never be two organizations with the same name for the same user
  validates :name, presence: true

  # TODO: once all organizations have a stripe_customer_id, add a database constraint to ensure presence & uniqueness
  validates :stripe_customer_id, presence: true, uniqueness: true

  before_validation :ensure_stripe_customer_created
  after_update :refresh_stripe_customer_data

  validate :sso_domain_coherent_with_user_email

  def can_create_new_authorizations?
    memberships.any?
  end

  def users
    User.where(email: authorizations.pluck(:email)).or(sso_users).or(User.where(id: user_id))
  end

  def sso_users
    User.where("email LIKE ?", "%@#{sso_domain}")
  end

  # TODO: Only return the subscription fields that we need
  def subscriptions
    return [] if stripe_customer_id.blank?
    Stripe::Subscription.list(customer: stripe_customer_id).data
  end

  private

  def ensure_stripe_customer_created
    return if stripe_customer_id.present?

    customer = Stripe::Customer.create(email: user.email, name: name, metadata: { cherry_organization_id: id })
    self.stripe_customer_id = customer.id
  end

  def refresh_stripe_customer_data
    return if stripe_customer_id.blank?

    Stripe::Customer.update(
      stripe_customer_id,
      { name: name, email: user.email, metadata: { cherry_organization_id: id } },
    )
  end

  def sso_domain_coherent_with_user_email
    return if !sso_enabled || sso_domain.blank?
    errors.add(:sso_domain, "should not be an email provider such as #{sso_domain}") if sso_domain.in?(EMAIL_PROVIDERS)
    return if user.email.split("@").last == sso_domain

    errors.add(:sso_domain, "must match the domain of the owner's email address")
  end
end
