// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'
import { LinearProgress } from '@mui/material'
import { useIsFetching } from '@tanstack/react-query'
import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import useCurrentUser from '../hooks/useCurrentUser'
import { useNotificationsIndex } from '../queries/user/notifications'
import CommandPalette, { CommandPaletteButton } from './CommandPalette'

const CherryNavbar = () => {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const isFetching = useIsFetching()
  const { data } = useNotificationsIndex()
  const notifications = data?.pages.flat()
  const unSeenNotificationsCount = notifications?.filter((notification) => !notification.seen_at).length || 0

  return (
    <>
      <CommandPalette />

      {isFetching > 0 && (
        <div className="absolute top-0 inset-x-0">
          <LinearProgress variant="indeterminate" sx={{ height: 2 }} />
        </div>
      )}

      <Navbar fluid>
        <div className="font-bold flex items-center">
          <Link to="/user/projects" className="flex items-center gap-2">
            🍒 Cherry
          </Link>
          <CommandPaletteButton />
        </div>

        {/* AVATAR MENU */}
        <div className="flex md:order-2 gap-3">
          <Button size="sm" color="dark" onClick={() => navigate('/user/notifications')} className="cursor-pointer">
            <NotificationsIcon />
            {unSeenNotificationsCount > 0 && (
              <span className="ml-1.5 text-xs font-semibold bg-red-500 text-white px-1.5 rounded-full">
                {unSeenNotificationsCount > 10 ? '10+' : unSeenNotificationsCount}
              </span>
            )}
          </Button>
          <Dropdown arrowIcon={false} inline={true} label={<Avatar alt="Avatar" img={user.image} rounded={true} />}>
            <Dropdown.Item onClick={() => navigate(`/user/users/${user.id}`)} className="w-64">
              <Avatar alt="Avatar" img={user.image} rounded={true} className="mr-2" size="xs" />
              {user.name}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => navigate('/user/settings')}>
              <SettingsIcon fontSize="small" className="mr-2" />
              Account Settings
            </Dropdown.Item>
            <Dropdown.Item onClick={() => (window.location.pathname = '/sign_out')}>
              <LogoutIcon fontSize="small" className="mr-2" />
              Sign out
            </Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>

        {/* NAVBAR LINKS */}
        <Navbar.Collapse className="md:mr-32">
          <Navbar.Link
            onClick={() => navigate('/user/projects')}
            active={window.location.pathname === '/user/projects'}
            className="cursor-pointer"
          >
            Projects
          </Navbar.Link>
          <Navbar.Link
            onClick={() => navigate('/user/dashboards')}
            active={window.location.pathname.includes('/user/dashboards')}
            className="cursor-pointer"
          >
            Dashboards
          </Navbar.Link>
          <Navbar.Link
            onClick={() => navigate('/user/authorizations')}
            active={window.location.pathname.includes('/user/authorizations')}
            className="cursor-pointer"
          >
            Authorizations
          </Navbar.Link>
          <Navbar.Link
            onClick={() => navigate('/user/docs')}
            active={window.location.pathname === '/user/docs'}
            className="cursor-pointer"
          >
            Docs
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default CherryNavbar
