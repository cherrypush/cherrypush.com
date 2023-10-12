import { Badge, Button, Card, Label, TextInput, ToggleSwitch } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useCurrentUser from '../hooks/useCurrentUser'
import { useOrganizationsShow, useOrganizationsUpdate } from '../queries/user/organizations'
import PageLoader from './PageLoader'

const formatPrice = (price: number) => `$${price / 100}`

const formatDate = (unixDate: number) =>
  new Date(unixDate * 1000)
    .toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    .toLowerCase()

const isValidDomain = (domain: string) => domain.match(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/)

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
  const { user: currentUser } = useCurrentUser()
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

  if (!organizationId) return null

  const { data: organizationData } = useOrganizationsShow({ organizationId: parseInt(organizationId) })
  const canEdit = organizationData && organizationData.user_id === currentUser.id

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

  const hasActiveSubscription = organizationData.subscriptions.some((subscription) => subscription.plan.active)

  return (
    <div className="container">
      <h1>{organizationData.name}</h1>

      <div className="card mb-9">
        <h2>Organization Settings</h2>
        <div className="flex max-w-md flex-col gap-4">
          {/* <Label htmlFor="organization_name">Name</Label>
          <TextInput id="organization_name" value={organizationData.name} disabled className="mb-1" /> */}
          <ToggleSwitch
            id="organization_sso_enabled"
            checked={organization.sso_enabled}
            label={`SSO ${organization.sso_enabled ? 'enabled' : 'disabled'}`}
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
              <TextInput
                id="organization_sso_domain"
                disabled={!canEdit}
                color={isValidDomain(organization.sso_domain) ? 'gray' : 'failure'}
                value={organization.sso_domain}
                onChange={(e) => setOrganization({ ...organization, sso_domain: e.target.value })}
              />
            </>
          )}
        </div>
      </div>

      <div className="card mb-9">
        <h2 className="flex justify-between">Plan</h2>
        <div className="mb-6">
          Learn more about or compare plans by visiting our{' '}
          <a className="text-link" href="/pricing" target="_blank">
            pricing page
          </a>
          .
        </div>

        {!hasActiveSubscription && (
          <form action="/user/subscriptions.json" method="POST">
            <input type="hidden" name="authenticity_token" value={csrfToken || ''} />
            <input type="hidden" name="organization_id" value={organizationId} />
            <input type="hidden" name="price_id" value="price_1MMDXACFqjlMoCRsgtB5zAPv" />
            <Button type="submit">Pay $99 per month</Button>
          </form>
        )}

        {organizationData.subscriptions.map((subscription) => (
          <Card className="max-w-sm" key={subscription.id}>
            <code>{subscription.id}</code>
            <p>
              {formatPrice(subscription.plan.amount)} per {subscription.plan.interval}
            </p>
            <p>Next payment on {formatDate(subscription.current_period_end)}</p>
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
