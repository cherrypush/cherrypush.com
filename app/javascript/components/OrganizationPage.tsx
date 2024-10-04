import { Divider } from '@mui/material'
import { Badge, Button, Card, Label, TextInput, ToggleSwitch } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getEnvironment } from '../helpers/applicationHelper'
import useCurrentUser from '../hooks/useCurrentUser'
import { useOrganizationsShow, useOrganizationsUpdate } from '../queries/user/organizations'
import PageLoader from './PageLoader'

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

// TODO: this should be moved to helpers.js
const formatPrice = (price: number) => `$${price / 100}`

// TODO: this should be moved to helpers.js
const formatDate = (unixDate: number) =>
  new Date(unixDate * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

// TODO: this should be moved to helpers.js
const isValidDomain = (domain: string) => domain.match(/^[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/)

interface OrganizationForm {
  id: number
  sso_enabled: boolean
  sso_domain: string
}

const OrganizationPage = () => {
  const { organizationId } = useParams()
  const [organization, setOrganization] = useState<OrganizationForm | null>(null)
  const { mutate: updateOrganization } = useOrganizationsUpdate()
  const isValid = organization && (!organization.sso_enabled || isValidDomain(organization.sso_domain))
  const user = useCurrentUser()
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

  if (!organizationId) return null

  // TODO: it's confusing to have both organization and organizationData, fix this
  const { data: organizationData } = useOrganizationsShow({ organizationId: parseInt(organizationId) })
  const canEdit = organizationData && organizationData.user_id === user.id

  useEffect(() => {
    if (organizationData) {
      setOrganization({
        id: organizationData.id,
        sso_enabled: organizationData.sso_enabled,
        sso_domain: organizationData.sso_domain || '',
      })
    }
  }, [organizationData])

  if (!organizationData || !organization) return <PageLoader />

  // TODO: type organizationData properly
  const hasActiveSubscription = organizationData.subscriptions.some((subscription) => subscription.plan.active)

  return (
    <div className="container">
      <h1 className="mb-6">{organizationData.name}</h1>

      <div className="card mb-9">
        <h2>Organization Details</h2>
        <div className="flex max-w-md flex-col gap-4">
          <Label htmlFor="organization_name">Name</Label>
          <TextInput id="organization_name" value={organizationData.name} disabled />
          <Label>Owner</Label>
          <TextInput value={organizationData.user.name} disabled />
          <TextInput value={organizationData.user.email} disabled />
          <Divider />
          <ToggleSwitch
            id="organization_sso_enabled"
            checked={organization.sso_enabled}
            label={organization.sso_enabled ? 'SSO enabled' : 'SSO disabled'}
            onChange={() => setOrganization({ ...organization, sso_enabled: !organization.sso_enabled })}
            disabled={!canEdit}
          />
          {organization.sso_enabled && (
            <>
              <Label
                color={isValidDomain(organization.sso_domain) ? 'gray' : 'failure'}
                htmlFor="organization_sso_domain"
              >
                SSO Domain
              </Label>
              <div className="flex items-center gap-3">
                <TextInput
                  id="organization_sso_domain"
                  disabled={!canEdit}
                  color={isValidDomain(organization.sso_domain) ? 'gray' : 'failure'}
                  value={organization.sso_domain}
                  onChange={(e) => setOrganization({ ...organization, sso_domain: e.target.value })}
                />
                <span className="text-sm font-medium">({organizationData.sso_user_count} users)</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card mb-9">
        <h2 className="flex justify-between">Subscription</h2>

        {!hasActiveSubscription && (
          <>
            <div className="mb-6">
              Learn more about or compare plans by visiting our{' '}
              <a className="text-link" href="/pricing" target="_blank">
                pricing page
              </a>
              .
            </div>
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
          </>
        )}

        {organizationData.subscriptions.map((subscription) => (
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

      <Button size="lg" onClick={() => updateOrganization(organization)} disabled={!isValid || !canEdit}>
        Update Organization
      </Button>
    </div>
  )
}

export default OrganizationPage
