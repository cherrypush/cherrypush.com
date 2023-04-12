import { ThemeProvider, createTheme } from '@mui/material/styles'
import React, { useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Route, Routes } from 'react-router'
import AuthorizationsPage from './AuthorizationsPage'
import DashboardsIndexPage from './DashboardsIndexPage'
import DashboardsShowPage from './DashboardsShowPage'
import DocsPage from './DocsPage'
import Footer from './Footer'
import Navbar from './Navbar'
import NewProjectPage from './NewProjectPage'
import ProjectsPage from './ProjectsPage'
import SettingsPage from './SettingsPage'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const App = ({ alert, notice }) => {
  useEffect(() => {
    if (alert) toast.error(alert)
    if (notice) toast.success(notice)
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      <Navbar />
      <div className="px-3 pt-3">
        <Routes>
          <Route path="user">
            <Route path="projects/new" element={<NewProjectPage />} />
            <Route path="dashboards" element={<DashboardsIndexPage />} />
            <Route path="dashboards/:id" element={<DashboardsShowPage />} />
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
    </ThemeProvider>
  )
}

export default App
