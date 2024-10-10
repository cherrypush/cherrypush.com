import { Divider } from '@mui/material'
import { Button, Label, TextInput, ToggleSwitch } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useCurrentUser from '../hooks/useCurrentUser'
import { useOrganizationsShow, useOrganizationsUpdate } from '../queries/user/organizations'
import PageLoader from './PageLoader'
import Subscriptions from './Subscriptions'

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

  if (!organizationId || !user) return null

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
      <Subscriptions
        subscriptions={organizationData.subscriptions}
        organizationId={organizationData.id}
        stripeCustomerPortalUrl={organizationData.stripe_customer_portal_url}
      />
      <Button size="lg" onClick={() => updateOrganization(organization)} disabled={!isValid || !canEdit}>
        Update Organization
      </Button>
    </div>
  )
}

export default OrganizationPage
