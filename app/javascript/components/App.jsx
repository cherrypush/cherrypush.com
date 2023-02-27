import React from 'react'
import { Route, Routes } from 'react-router'
import AuthorizationsIndex from './AuthorizationsIndex'
import DocsPage from './DocsPage'
import Footer from './Footer'
import MetricsPage from './MetricsPage'
import Navbar from './Navbar'
import NewProjectPage from './NewProjectPage'
import ProjectsIndex from './ProjectsPage'
import SettingsPage from './SettingsPage'

const App = () => (
  <>
    <Navbar />
    <div className="px-3 pt-3">
      <Routes>
        <Route path="user">
          <Route path="projects" element={<ProjectsIndex />} />
          <Route path="projects/new" element={<NewProjectPage />} />
          <Route path="metrics" element={<MetricsPage />} />
          <Route path="authorizations" element={<AuthorizationsIndex />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="docs" element={<DocsPage />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  </>
)

export default App
