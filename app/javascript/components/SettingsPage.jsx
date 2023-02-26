import { Label, TextInput } from 'flowbite-react'
import React from 'react'
import useCurrentUser from '../hooks/useCurrentUser'

const SettingsPage = () => {
  const { user } = useCurrentUser()

  return (
    <>
      <h1>Settings</h1>

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
        <Label htmlFor="api_key">API Key</Label>
        <TextInput type="text" id="api_key" value={user.api_key} disabled />
      </div>
    </>
  )
}

export default SettingsPage
