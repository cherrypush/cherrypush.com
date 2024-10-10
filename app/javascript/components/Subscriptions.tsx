import { Badge, Button, Card } from 'flowbite-react'
import { getEnvironment } from '../helpers/applicationHelper'
import { Subscription } from '../queries/user/organizations'

// TODO: this should be moved to helpers.js
const formatPrice = (price: number) => `$${price / 100}`

// TODO: this should be moved to helpers.js
const formatDate = (unixDate: number) =>
  new Date(unixDate * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

// TODO: this function should get the plans from the backend, and the backend should get them from Stripe
const getPlans = () => [
  {
    name: 'Team Plan',
    price: 900,
    interval: 'month',
    priceId: getEnvironment() === 'production' ? 'price_1MKPW7CFqjlMoCRsCXxEKPBa' : 'price_1MMDbRCFqjlMoCRsrRC2Z6Fj',
    conditions: 'Ideal for small teams with up to 10 users and at most 10 projects. Support via email.',
  },
  {
    name: 'Organization Plan',
    price: 9900,
    interval: 'month',
    priceId: getEnvironment() === 'production' ? 'price_1MMDWACFqjlMoCRsab9f3eAL' : 'price_1MMDXACFqjlMoCRsgtB5zAPv',
    conditions: 'Unlimited users, unlimited projects, single sign-on (SSO), support via chat and email.',
  },
  {
    name: 'Organization Plan',
    price: 99000,
    interval: 'year',
    priceId: getEnvironment() === 'production' ? 'price_1NaeOjCFqjlMoCRs5xQWSt5M' : 'price_1O0f9XCFqjlMoCRsexKNDNK8',
    conditions: 'Unlimited users, unlimited projects, single sign-on (SSO), support via chat and email.',
  },
]

const Subscriptions = ({
  subscriptions,
  organizationId,
  stripeCustomerPortalUrl,
}: {
  subscriptions: Subscription[]
  organizationId: number
  stripeCustomerPortalUrl: string
}) => {
  const hasActiveSubscription = subscriptions.some((subscription) => subscription.plan.active)
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

  return (
    <div className="card mb-9">
      <h2 className="flex justify-between">
        Subscription
        {hasActiveSubscription && (
          <Button className="float-right" onClick={() => window.location.assign(stripeCustomerPortalUrl)}>
            Manage Subscription
          </Button>
        )}
      </h2>

      {!hasActiveSubscription && (
        <div className="mb-6">
          Learn more about or compare plans by visiting our{' '}
          <a className="text-link" href="/pricing" target="_blank">
            pricing page
          </a>
          .
        </div>
      )}

      {!hasActiveSubscription && (
        <div className="flex gap-3">
          {getPlans().map((plan) => (
            <Card key={plan.priceId} className="w-1/3">
              <div className="text-xl font-bold">{plan.name}</div>
              <p>{plan.conditions}</p>
              <form action="/user/subscriptions.json" method="POST">
                <input type="hidden" name="authenticity_token" value={csrfToken || ''} />
                <input type="hidden" name="organization_id" value={organizationId} />
                <input type="hidden" name="price_id" value={plan.priceId} />
                <Button type="submit" fullSized>
                  Pay ${plan.price / 100} per {plan.interval}
                </Button>
              </form>
            </Card>
          ))}
        </div>
      )}

      {subscriptions.map((subscription) => (
        <Card className="max-w-sm" key={subscription.id}>
          <code>{subscription.id}</code>
          <p>
            {formatPrice(subscription.plan.amount)} per {subscription.plan.interval}
          </p>
          <p>Current period ends on {formatDate(subscription.current_period_end)}</p>
          <div className="flex">
            <Badge color={subscription.status === 'active' ? 'success' : 'failure'}>{subscription.status}</Badge>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default Subscriptions
