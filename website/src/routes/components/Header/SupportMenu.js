import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { space, COLORS } from 'Theme'
import { Flex } from 'components/Layout'
import Link from 'components/RouterLink'
import { Text } from 'components/Typography'

const Menu = styled('nav')`
  display: flex;
  flex-direction: column;

  padding-top: ${space.s};
  padding-bottom: ${space.s};
`

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;

  padding: 0 ${space.m};
  line-height: ${rem('34px')};

  text-decoration: none;
  white-space: nowrap;
  text-align: left;

  color: ${COLORS.SPACE_CADET};

  &:hover {
    background-color: ${COLORS.IRRADIANT_IRIS};
  }
`

const SupportMenu = ({ planButtonComp, requestButtonComp, isMobileView }) => (
  <Menu>
    {isMobileView && (
      <MenuItem to="https://trip.nextretreat.com/why-next-retreat/" target="_self">Why NextRetreat</MenuItem>
    )}
    <MenuItem to="/how-it-works">How it works</MenuItem>
    <MenuItem to="/testimonials">Customers</MenuItem>
    <MenuItem to={process.env.GATSBY_BLOG_URL}>Blog</MenuItem>
    {requestButtonComp && (
      <Flex flexDirection="column" mx="m" my="s">
        {requestButtonComp}
      </Flex>
    )}
    {requestButtonComp && planButtonComp && <Text textAlign="center">or</Text>}
    {planButtonComp && (
      <Flex flexDirection="column" mx="m" my="s">
        {planButtonComp}
      </Flex>
    )}
  </Menu>
)

SupportMenu.propTypes = {
  planButtonComp: PropTypes.node,
  requestButtonComp: PropTypes.node,
}

export default SupportMenu
