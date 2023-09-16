import { Button, Label, TextInput } from 'flowbite-react'
import { useParams } from 'react-router-dom'
import { useOrganizationsShow } from '../queries/user/organizations'
import PageLoader from './PageLoader'

const OrganizationPage = () => {
  const { organizationId } = useParams()
  if (!organizationId) return null

  const { data: organization } = useOrganizationsShow({ organizationId: parseInt(organizationId) })

  if (!organization) return <PageLoader />

  return (
    <div className="container">
      <h1>{organization.name}</h1>

      <div className="card mb-9">
        <h2>Organization Details</h2>
        <div className="flex max-w-md flex-col gap-4">
          <Label htmlFor="organization_name">Display Name</Label>
          <TextInput id="organization_name" type="text" value={organization.name} disabled />
          {/* <Label htmlFor="organization_handle">Unique Handle</Label>
          <TextInput id="organization_handle" type="text" value={organization.handle} disabled /> */}
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

      <Button size="lg">Update Organization</Button>
    </div>
  )
}

export default OrganizationPage
