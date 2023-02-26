import React from 'react'
import { Route, Routes } from 'react-router'
import AuthorizationsIndex from './AuthorizationsIndex'
import MetricsPage from './MetricsPage'
import NewProjectPage from './NewProjectPage'
import ProjectsIndex from './ProjectsPage'
import SettingsPage from './SettingsPage'

const App = () => (
  <Routes>
    <Route path="user">
      <Route path="projects" element={<ProjectsIndex />} />
      <Route path="projects/new" element={<NewProjectPage />} />
      <Route path="metrics" element={<MetricsPage />} />
      <Route path="authorizations" element={<AuthorizationsIndex />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
  </Routes>
)

export default App
