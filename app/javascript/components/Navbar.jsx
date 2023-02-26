import { Turbo } from '@hotwired/turbo-rails'
import LockPersonIcon from '@mui/icons-material/LockPerson'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import { Avatar, Dropdown, Navbar } from 'flowbite-react'
import React from 'react'
import useCurrentUser from '../hooks/useCurrentUser'
import CommandPalette from './CommandPalette'

const CherryNavbar = () => {
  const { user } = useCurrentUser()

  return (
    <>
      <CommandPalette />

      <Navbar fluid>
        <Navbar.Brand onClick={() => Turbo.visit('/user/projects')} className="cursor-pointer font-bold">
          🍒 Cherry
        </Navbar.Brand>

        {/* AVATAR MENU */}
        <div className="flex md:order-2">
          <Dropdown arrowIcon={false} inline={true} label={<Avatar alt="Avatar" img={user.image} rounded={true} />}>
            <Dropdown.Header>
              <span className="block text-sm">{user.name}</span>
              <span className="block truncate text-sm font-medium">{user.email}</span>
            </Dropdown.Header>
            <Dropdown.Item icon={LockPersonIcon} onClick={() => Turbo.visit('/user/authorizations')}>
              Authorizations
            </Dropdown.Item>
            <Dropdown.Item icon={SettingsIcon} onClick={() => Turbo.visit('/user/settings')}>
              My Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={LogoutIcon} onClick={() => (window.location = '/sign_out')}>
              Sign out
            </Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>

        {/* NAVBAR LINKS */}
        <Navbar.Collapse>
          <Navbar.Link
            onClick={() => Turbo.visit('/user/projects')}
            active={window.location.pathname === '/user/projects'}
            className="cursor-pointer"
          >
            Projects
          </Navbar.Link>
          <Navbar.Link
            onClick={() => Turbo.visit('/user/metrics')}
            active={window.location.pathname === '/user/metrics'}
            className="cursor-pointer"
          >
            Metrics
          </Navbar.Link>
          <Navbar.Link
            onClick={() => Turbo.visit('/docs')}
            active={window.location.pathname === '/docs'}
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
