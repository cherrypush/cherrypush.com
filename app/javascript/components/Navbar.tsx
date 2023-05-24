import NotificationsIcon from '@mui/icons-material/Notifications'
import { LinearProgress } from '@mui/material'
import { useIsFetching } from '@tanstack/react-query'
import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react'
import React from 'react'
import { MdFavorite, MdLockPerson, MdLogout, MdSettings } from 'react-icons/md'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import useCurrentUser from '../hooks/useCurrentUser'
import { useNotificationsIndex } from '../queries/user/notifications'
import CommandPalette, { CommandPaletteButton } from './CommandPalette'

const CherryNavbar = () => {
  const { user } = useCurrentUser()
  const navigate = useNavigate()
  const isFetching = useIsFetching()
  const { data: notifications } = useNotificationsIndex()
  const unSeenNotificationsCount = notifications?.filter((notification) => !notification.seen_at).length

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
          <Link to="/user/projects">🍒 Cherry</Link>
          <CommandPaletteButton />
        </div>

        {/* AVATAR MENU */}
        <div className="flex md:order-2 gap-3">
          <Button size="sm" color="dark" onClick={() => navigate('/user/notifications')} className="cursor-pointer">
            <NotificationsIcon />
            {unSeenNotificationsCount > 0 && (
              <span className="ml-1.5 text-xs font-semibold bg-red-500 text-white px-1.5 rounded-full">
                {unSeenNotificationsCount}
              </span>
            )}
          </Button>
          <Dropdown arrowIcon={false} inline={true} label={<Avatar alt="Avatar" img={user.image} rounded={true} />}>
            <Dropdown.Header>
              <span className="block text-sm">{user.name}</span>
              <span className="block truncate text-sm font-medium">{user.email}</span>
            </Dropdown.Header>
            <Dropdown.Item icon={MdFavorite} onClick={() => navigate('/user/contributions')}>
              My Contributions
            </Dropdown.Item>
            <Dropdown.Item icon={MdSettings} onClick={() => navigate('/user/settings')}>
              My Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={MdLockPerson} onClick={() => navigate('/user/authorizations')}>
              Authorizations
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={MdLogout} onClick={() => (window.location = '/sign_out')}>
              Sign out
            </Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>

        {/* NAVBAR LINKS */}
        <Navbar.Collapse className="md:mr-32">
          <Navbar.Link
            onClick={() => navigate('/user/dashboards')}
            active={window.location.pathname.includes('/user/dashboards')}
            className="cursor-pointer"
          >
            Dashboards
          </Navbar.Link>
          <Navbar.Link
            onClick={() => navigate('/user/projects')}
            active={window.location.pathname === '/user/projects'}
            className="cursor-pointer"
          >
            Projects
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
