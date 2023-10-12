# frozen_string_literal: true

class Organization < ApplicationRecord
  belongs_to :user
  has_many :memberships
  has_many :authorizations, dependent: :destroy

  validates :name, presence: true
  # TODO: there should never be two organizations with the same name for the same user

  validates :stripe_customer_id, presence: true, uniqueness: true
  # TODO: once all organizations have a stripe_customer_id, add a database constraint to ensure presence & uniqueness

  before_validation :ensure_stripe_customer_created
  after_update :refresh_stripe_customer_data

  def can_create_new_authorizations?
    return false, "A paid plan is required to create authorizations. Reach out to #{user.name}." if memberships.empty?

    true
  end

  def users
    User.where(id: authorizations.pluck(:user_id) + [user_id])
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
end
