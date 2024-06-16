# frozen_string_literal: true

class Organization < ApplicationRecord
  EMAIL_PROVIDERS = %w[gmail.com yahoo.com hotmail.com outlook.com aol.com icloud.com].freeze

  belongs_to :user

  has_many :memberships, dependent: :destroy
  has_many :projects
  has_many :authorizations, dependent: :destroy

  validates :name, presence: true # TODO: there should never be two organizations with the same name for the same user
  validates :stripe_customer_id, uniqueness: true, allow_nil: true

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
    User.where('email LIKE ?', "%@#{sso_domain}")
  end

  # TODO: Only return the subscription fields that we need
  def subscriptions
    return [] if stripe_customer_id.blank?

    Stripe::Subscription.list(customer: stripe_customer_id).data
  end

  private

  def ensure_stripe_customer_created
    return if stripe_customer_id.present?
    return if Rails.env.test?

    customer = Stripe::Customer.create(email: user.email, name: name, metadata: { cherry_organization_id: id })
    self.stripe_customer_id = customer.id
  end

  def refresh_stripe_customer_data
    return if stripe_customer_id.blank?
    return if Rails.env.test?

    Stripe::Customer.update(
      stripe_customer_id,
      { name: name, email: user.email, metadata: { cherry_organization_id: id } }
    )
  end

  def sso_domain_coherent_with_user_email
    return if !sso_enabled || sso_domain.blank?

    errors.add(:sso_domain, "should not be an email provider such as #{sso_domain}") if sso_domain.in?(EMAIL_PROVIDERS)
    return if user.email.split('@').last == sso_domain

    errors.add(:sso_domain, "must match the domain of the owner's email address")
  end
end
