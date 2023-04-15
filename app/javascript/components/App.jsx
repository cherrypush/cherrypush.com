import { ThemeProvider, createTheme } from '@mui/material/styles'
import axios from 'axios'
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

axios.defaults.headers.common['X-CSRF-Token'] = document
  .querySelector('meta[name="csrf-token"]')
  ?.getAttribute('content')
axios.defaults.headers.common['Content-type'] = 'application/json; charset=UTF-8'

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
            <Route path="dashboards/:dashboardId" element={<DashboardsShowPage />} />
            <Route path="dashboards/:dashboardId/charts/new" element={<DashboardsShowPage />} />
            <Route path="dashboards/:dashboardId/charts/:chartId/edit" element={<DashboardsShowPage />} />
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
