import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Toaster, toast } from 'react-hot-toast'
import { Route, Routes } from 'react-router'

import axios from 'axios'
import { useEffect } from 'react'
import useCurrentUser from '../hooks/useCurrentUser'
import AuthorizationsPage from './AuthorizationsPage'
import CherryNavbar from './CherryNavbar'
import DashboardsIndexPage from './DashboardsIndexPage'
import DashboardsShowPage from './DashboardsShowPage'
import DocsPage from './DocsPage'
import Footer from './Footer'
import NewOrganizationPage from './NewOrganizationPage'
import NewProjectPage from './NewProjectPage'
import NotificationsPage from './NotificationsPage'
import OrganizationPage from './OrganizationPage'
import ProjectsPage from './ProjectsPage'
import ScrollToTop from './ScrollToTop'
import SettingsPage from './SettingsPage'
import { slideUp } from './SlideUp'
import UserPage from './UserPage'

axios.defaults.headers.common['X-CSRF-Token'] = document
  .querySelector('meta[name="csrf-token"]')
  ?.getAttribute('content')
axios.defaults.headers.common['Accept'] = 'application/json'

const darkTheme = createTheme({ palette: { mode: 'dark' } })

const App = ({ alert, notice }: { alert: string; notice: string }) => {
  const user = useCurrentUser()

  if (!user) return null

  useEffect(() => {
    if (alert) toast.error(alert)
    if (notice) toast.success(notice)
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      <CherryNavbar />
      <div className="px-3 pt-3">
        <ScrollToTop>
          <Routes>
            <Route path="user">
              <Route path="authorizations" element={slideUp(<AuthorizationsPage />)} />
              <Route path="dashboards" element={slideUp(<DashboardsIndexPage />)} />
              <Route path="dashboards/:dashboardId" element={slideUp(<DashboardsShowPage />)} />
              <Route path="dashboards/:dashboardId/charts/:chartId/edit" element={slideUp(<DashboardsShowPage />)} />
              <Route path="dashboards/:dashboardId/charts/new" element={slideUp(<DashboardsShowPage />)} />
              <Route path="docs" element={slideUp(<DocsPage />)} />
              <Route path="notifications" element={slideUp(<NotificationsPage />)} />
              <Route path="organizations/new" element={slideUp(<NewOrganizationPage />)} />
              <Route path="organizations/:organizationId" element={slideUp(<OrganizationPage />)} />
              <Route path="projects" element={slideUp(<ProjectsPage />)} />
              <Route path="projects/new" element={slideUp(<NewProjectPage />)} />
              <Route path="settings" element={slideUp(<SettingsPage />)} />
              <Route path="users/:userId" element={<UserPage />} />
            </Route>
          </Routes>
        </ScrollToTop>
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
