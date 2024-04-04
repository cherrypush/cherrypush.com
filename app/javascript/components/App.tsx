import { ThemeProvider, createTheme } from '@mui/material/styles'
import axios from 'axios'
import { Banner, Button } from 'flowbite-react'
import { useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Route, Routes } from 'react-router'
import useCurrentUser from '../hooks/useCurrentUser'
import AuthorizationsPage from './AuthorizationsPage'
import DashboardsIndexPage from './DashboardsIndexPage'
import DashboardsShowPage from './DashboardsShowPage'
import DocsPage from './DocsPage'
import Footer from './Footer'
import Navbar from './Navbar'
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

const DeprecationBanner = () => (
  <Banner>
    <div className="flex w-full justify-between border-b p-4 dark:border-gray-600 dark:bg-gray-700">
      <div className="container flex items-center justify-between !my-2">
        <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
          <span className="[&_p]:inline">
            {`We're `}
            <a
              href="https://doctolib.atlassian.net/wiki/spaces/PTA/pages/1570578028/Cherry+Decommissioning+Plan"
              className="inline font-medium text-cyan-600 underline decoration-solid underline-offset-2 hover:no-underline dark:text-yellow-500"
              target="_blank"
              rel="noreferrer"
            >
              decommissioning cherrypush.com
            </a>{' '}
            at Doctolib and your account is set for deletion on <strong>April 12th</strong>.
            <br />
            Please use{' '}
            <a
              href="https://metabase.doctolibdata.com/dashboard/1652-dashboard?metric=TS%20Migration%20-%20JS%20lines%20of%20code"
              className="inline font-medium text-cyan-600 underline decoration-solid underline-offset-2 hover:no-underline dark:text-yellow-500"
              target="_blank"
              rel="noreferrer"
            >
              Cherry on Metabase
            </a>{' '}
            instead. For further questions, reach out via #cherry on Slack.
          </span>
        </p>
        <Button
          color="yellow"
          href="https://metabase.doctolibdata.com/dashboard/1652-dashboard?metric=TS%20Migration%20-%20JS%20lines%20of%20code"
          target="_blank"
          rel="noreferrer"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              {' '}
              <g id="Interface / External_Link">
                {' '}
                <path
                  id="Vector"
                  d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{' '}
              </g>{' '}
            </g>
          </svg>
          Go to Metabase
        </Button>
      </div>
    </div>
  </Banner>
)

const App = ({ alert, notice }: { alert: string; notice: string }) => {
  const user = useCurrentUser()

  if (!user) return null

  useEffect(() => {
    if (alert) toast.error(alert)
    if (notice) toast.success(notice)
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      <Navbar />
      {user.email.includes('@doctolib.com') && <DeprecationBanner />}
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
