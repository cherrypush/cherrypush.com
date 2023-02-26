import React from 'react'
import useCurrentUser from '../hooks/useCurrentUser'

const SettingsPage = () => {
  const { user } = useCurrentUser()

  return (
    <>
      <h1>Settings</h1>

      <form>
        <div className="mb-6">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Your name
          </label>
          <input
            type="text"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={user.name}
            required
            disabled
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Your email
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={user.email}
            required
            disabled
          />
        </div>

        <div className="mb-6">
          <label htmlFor="github_handle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            GitHub Handle
          </label>
          <input
            type="text"
            id="github_handle"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={user.github_handle}
            required
            disabled
          />
        </div>

        <div className="mb-6">
          <label htmlFor="api_key" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            API Key
          </label>
          <input
            type="text"
            id="api_key"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={user.api_key}
            required
            disabled
          />
        </div>
      </form>
    </>
  )
}

export default SettingsPage
