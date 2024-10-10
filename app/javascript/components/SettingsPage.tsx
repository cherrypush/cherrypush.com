import { FormControlLabel, Switch } from '@mui/material'
import { Button, Label, TextInput } from 'flowbite-react'
import { useState } from 'react'
import useCurrentUser from '../hooks/useCurrentUser'
import { useSettingsUpdate } from '../queries/user/settings'

const SettingsPage = () => {
  const user = useCurrentUser()
  const { mutate: updateUser } = useSettingsUpdate()

  if (!user) throw new Error('This page cannot be loaded without a user')

  const [githubHandle, setGithubHandle] = useState(user.github_handle)
  const [weeklyReport, setWeeklyReport] = useState(user.weekly_report)

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
          <TextInput
            type="text"
            id="github_handle"
            value={githubHandle}
            onChange={(event) => setGithubHandle(event.target.value)}
          />
        </div>

        <div className="mb-3 gap-1 flex flex-col">
          <Label htmlFor="api_key">API Key</Label>
          <TextInput type="text" id="api_key" value={user.api_key} disabled />
        </div>

        <div className="mb-3 gap-1 flex flex-col">
          <Label>Weekly Report</Label>
          <FormControlLabel
            label="Receive a weekly email with your project metrics"
            control={<Switch checked={weeklyReport} onChange={(event) => setWeeklyReport(event.target.checked)} />}
          />
        </div>

        <Button onClick={() => updateUser({ weekly_report: weeklyReport, github_handle: githubHandle })}>
          Save changes
        </Button>
      </div>
    </div>
  )
}

export default SettingsPage
