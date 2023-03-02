import LockPersonIcon from '@mui/icons-material/LockPerson'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import { Avatar, Dropdown, Navbar } from 'flowbite-react'
import React from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import useCurrentUser from '../hooks/useCurrentUser'
import CommandPalette, { CommandPaletteButton } from './CommandPalette'

const CherryNavbar = () => {
  const { user } = useCurrentUser()
  const navigate = useNavigate()

  return (
    <>
      <CommandPalette />

      <Navbar fluid>
        <div className="font-bold flex items-center">
          <Link to="/user/projects">🍒 Cherry</Link>
          <CommandPaletteButton />
        </div>

        {/* AVATAR MENU */}
        <div className="flex md:order-2">
          <Dropdown arrowIcon={false} inline={true} label={<Avatar alt="Avatar" img={user.image} rounded={true} />}>
            <Dropdown.Header>
              <span className="block text-sm">{user.name}</span>
              <span className="block truncate text-sm font-medium">{user.email}</span>
            </Dropdown.Header>
            <Dropdown.Item icon={LockPersonIcon} onClick={() => navigate('/user/authorizations')}>
              Authorizations
            </Dropdown.Item>
            <Dropdown.Item icon={SettingsIcon} onClick={() => navigate('/user/settings')}>
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
            onClick={() => navigate('/user/projects')}
            active={window.location.pathname === '/user/projects'}
            className="cursor-pointer"
          >
            Projects
          </Navbar.Link>
          <Navbar.Link
            onClick={() => navigate('/user/metrics')}
            active={window.location.pathname === '/user/metrics'}
            className="cursor-pointer"
          >
            Metrics
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
