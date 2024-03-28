import { FormControlLabel, Switch } from '@mui/material'
import { Label, TextInput } from 'flowbite-react'
import useCurrentUser from '../hooks/useCurrentUser'
import { useSettingsUpdate } from '../queries/user/settings'

const SettingsPage = () => {
  const user = useCurrentUser()
  const { mutate: updateUser } = useSettingsUpdate()

  return (
    <div className="container">
      <h1 className="mb-6">Settings</h1>

      <div className="card">
        <div className="mb-3 gap-1 flex flex-col">
          <Label htmlFor="name">Name</Label>
          <TextInput type="text" id="name" value={user.name} disabled />
        </div>

        <div className="mb-3 gap-1 flex flex-col">
          <Label htmlFor="email">Email</Label>
          <TextInput type="email" id="email" value={user.email} disabled />
        </div>

        <div className="mb-3 gap-1 flex flex-col">
          <Label htmlFor="github_handle">GitHub Handle</Label>
          <TextInput type="text" id="github_handle" value={user.github_handle} disabled />
        </div>

        <div className="mb-3 gap-1 flex flex-col">
          <Label htmlFor="github_handle">GitHub Organizations</Label>
          <TextInput type="text" id="github_handle" value={user.github_organizations} disabled />
        </div>

        <div className="mb-3 gap-1 flex flex-col">
          <Label htmlFor="api_key">API Key</Label>
          <TextInput type="text" id="api_key" value={user.api_key} disabled />
        </div>

        <div className="mb-3 gap-1 flex flex-col">
          <Label htmlFor="weekly_report">Weekly Report</Label>
          <FormControlLabel
            label="Receive a weekly email with your project metrics"
            control={
              <Switch
                id="weekly_report"
                name="Receive a weekly email with your project metrics"
                checked={user.weekly_report}
                onChange={(event) => updateUser({ weekly_report: event.target.checked })}
              />
            }
          />
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
