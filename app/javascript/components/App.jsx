import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router'
import AuthorizationsIndex from './AuthorizationsIndex'
import DocsPage from './DocsPage'
import Footer from './Footer'
import MetricsPage from './MetricsPage'
import Navbar from './Navbar'
import NewProjectPage from './NewProjectPage'
import SettingsPage from './SettingsPage'
import { toast, Toaster } from 'react-hot-toast'

const App = ({ alert, notice }) => {
  useEffect(() => {
    if (alert) toast.error(alert)
    if (notice) toast.success(notice)
  }, [])

  return (
    <>
      <Navbar />
      <div className="px-3 pt-3">
        <Routes>
          <Route path="user">
            {/* <Route path="projects" element={<ProjectsPage />} /> */}
            <Route path="projects/new" element={<NewProjectPage />} />
            <Route path="projects" element={<MetricsPage />} />
            <Route path="authorizations" element={<AuthorizationsIndex />} />
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
    </>
  )
}

export default App
