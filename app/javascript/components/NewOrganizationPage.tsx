import { Button, Label, TextInput, Tooltip } from 'flowbite-react'

const NewOrganizationPage = () => {
  return (
    <div className="container">
      <h1>Create a New Organization</h1>

      <div className="card mb-9">
        <h2>Organization Details</h2>
        <div className="flex max-w-md flex-col gap-4">
          <Label htmlFor="organization_name">Name</Label>
          <TextInput id="organization_name" type="text" />
        </div>
      </div>

      <div className="card mb-9">
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
      </div>

      <div className="card mb-9">
        <h2>Payment Method</h2>
        <div className="mb-6">No card on file.</div>
        <Tooltip content="Under development">
          <Button color="light">Add card</Button>
        </Tooltip>
      </div>

      <Button size="lg">Create Organization</Button>
    </div>
  )
}

export default NewOrganizationPage
