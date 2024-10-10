import { Divider, FormControlLabel, Switch } from '@mui/material'
import { Button, Label, TextInput } from 'flowbite-react'
import { ChangeEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDomainFromEmail, isValidDomain } from '../helpers/helpers'
import useCurrentUser from '../hooks/useCurrentUser'
import { useOrganizationsShow, useOrganizationsUpdate } from '../queries/user/organizations'
import PageLoader from './PageLoader'
import Subscriptions from './Subscriptions'

interface OrganizationForm {
  id: number
  sso_enabled: boolean
  sso_domain: string
}

const OrganizationPage = () => {
  const { organizationId } = useParams()
  const [organizationState, setOrganizationState] = useState<OrganizationForm | null>(null)
  const { mutate: updateOrganization } = useOrganizationsUpdate()
  const isValid = organizationState && (!organizationState.sso_enabled || isValidDomain(organizationState.sso_domain))
  const user = useCurrentUser()

  if (!organizationId || !user) return null

  // TODO: it's confusing to have both organization and organizationData, fix this
  const { data: organization } = useOrganizationsShow({ organizationId: parseInt(organizationId) })
  const canEdit = organization && organization.user_id === user.id

  useEffect(() => {
    if (organization) {
      setOrganizationState({
        id: organization.id,
        sso_enabled: organization.sso_enabled,
        sso_domain: organization.sso_domain || '',
      })
    }
  }, [organization])

  if (!organization || !organizationState) return <PageLoader />

  const toggleSsoEnabled = (checked: ChangeEvent<HTMLInputElement>) =>
    setOrganizationState({
      ...organizationState,
      sso_enabled: !organizationState.sso_enabled,
      sso_domain: checked ? getDomainFromEmail(user.email) : '',
    })

  return (
    <div className="container">
      <h1 className="mb-6">{organization.name}</h1>

      <div className="card mb-9">
        <h2>Organization Details</h2>
        <div className="flex max-w-md flex-col gap-4">
          <Label htmlFor="organization_name">Name</Label>
          <TextInput id="organization_name" value={organization.name} disabled />
          <Label>Owner</Label>
          <TextInput value={organization.user.name} disabled />
          <TextInput value={organization.user.email} disabled />
          <Divider />
          <FormControlLabel
            label={organizationState.sso_enabled ? 'SSO enabled' : 'SSO disabled'}
            disabled={!canEdit}
            control={<Switch checked={organizationState.sso_enabled} onChange={toggleSsoEnabled} />}
          />
          {organizationState.sso_enabled && (
            <>
              <Label
                color={isValidDomain(organizationState.sso_domain) ? 'gray' : 'failure'}
                htmlFor="organization_sso_domain"
              >
                SSO Domain
              </Label>
              <div className="flex items-center gap-3">
                <TextInput
                  id="organization_sso_domain"
                  disabled
                  color={isValidDomain(organizationState.sso_domain) ? 'gray' : 'failure'}
                  value={organizationState.sso_domain}
                />
                <span className="text-sm font-medium">({organization.sso_user_count} users)</span>
              </div>
            </>
          )}
        </div>
      </div>
      <Subscriptions
        subscriptions={organization.subscriptions}
        organizationId={organization.id}
        stripeCustomerPortalUrl={organization.stripe_customer_portal_url}
      />
      <Button size="lg" onClick={() => updateOrganization(organizationState)} disabled={!isValid || !canEdit}>
        Update Organization
      </Button>
    </div>
  )
}

export default OrganizationPage
