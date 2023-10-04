import { Button, Label, TextInput, ToggleSwitch } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useCurrentUser from '../hooks/useCurrentUser'
import { useOrganizationsShow, useOrganizationsUpdate } from '../queries/user/organizations'
import PageLoader from './PageLoader'

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
  const currentUser = useCurrentUser()

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

  return (
    <div className="container">
      <h1>{organizationData.name}</h1>

      <div className="card mb-9">
        <h2>Organization Details</h2>
        <div className="flex max-w-md flex-col gap-4">
          <Label htmlFor="organization_name">Display Name</Label>
          <TextInput id="organization_name" value={organizationData.name} disabled className="mb-1" />
          <ToggleSwitch
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

      {/* <div className="card mb-9">
        <h2 className="mb-3">Plan</h2>
        <div className="mb-6">
          Learn more about or compare plans by visiting our{' '}
          <a className="text-link" href="/pricing" target="_blank">
            pricing page
          </a>
          .
        </div>
        <Tooltip content="Under development">
          <Button color="light">Add card</Button>
        </Tooltip>
      </div> */}

      {/* <div className="card mb-9">
        <h2>Payment Method</h2>
        <div className="mb-6">No card on file.</div>
        <Tooltip content="Under development">
          <Button color="light">Add card</Button>
        </Tooltip>
      </div> */}

      <Button size="lg" onClick={() => updateOrganization(organization)} disabled={!isValid}>
        Update Organization
      </Button>
    </div>
  )
}

export default OrganizationPage
