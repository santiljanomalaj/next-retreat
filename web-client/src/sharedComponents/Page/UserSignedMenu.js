import React from 'react'
import styled from 'styled-components'
import { rem } from 'polished'
import { space, COLORS } from 'Theme'
import { useAuth } from 'AuthProvider'

const Menu = styled('nav')`
  display: flex;
  flex-direction: column;
`

const MenuItem = styled('a')`
  display: flex;
  align-items: center;

  padding: ${space.s};
  line-height: ${rem('34px')};

  text-decoration: none;
  white-space: nowrap;
  text-align: left;

  color: ${COLORS.SPACE_CADET};

  &:hover {
    background-color: ${COLORS.IRRADIANT_IRIS};
  }
`

const UserSignedMenu = () => {
  const { signOut } = useAuth()
  return (
    <Menu>
      <MenuItem as="button" type="button" onClick={signOut}>
        Logout
      </MenuItem>
    </Menu>
  )
}

export default UserSignedMenu
