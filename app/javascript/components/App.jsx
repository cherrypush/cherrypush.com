import { CssVarsProvider } from '@mui/joy/styles'
import React, { useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router'
import AuthorizationsPage from './AuthorizationsPage'
import DocsPage from './DocsPage'
import Footer from './Footer'
import Navbar from './Navbar'
import NewProjectPage from './NewProjectPage'
import ProjectsPage from './ProjectsPage'
import SettingsPage from './SettingsPage'

const App = ({ alert, notice }) => {
  useEffect(() => {
    if (alert) toast.error(alert)
    if (notice) toast.success(notice)
  }, [])

  return (
    <CssVarsProvider defaultMode="dark">
      <Navbar />
      <div className="px-3 pt-3">
        <Routes>
          <Route path="user">
            <Route path="projects/new" element={<NewProjectPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="authorizations" element={<AuthorizationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="docs" element={<DocsPage />} />
          </Route>
        </Routes>
        <Footer />
        <Toaster
          containerClassName="mt-12"
          toastOptions={{
            style: {
              borderRadius: '10px',
              background: '#0B1119',
              color: '#fff',
              border: '1px solid #1F2A37',
            },
          }}
        />
      </div>
    </CssVarsProvider>
  )
}

export default App
