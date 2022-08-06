import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'gatsby'

const StyledLink = styled(Link)`
  text-decoration: none;

  color: inherit;
`

const RouterLink = ({ children, to, ...props }) => {
  const openNewTab = to !== process.env.GATSBY_BLOG_URL
  const linkProps = /^\/(?!\/)/.test(to)
    ? { to }
    : {
        as: 'a',
        href: to,
        ...(openNewTab && { rel: 'noreferrer noopener', target: '_blank' }),
      }

  return (
    <StyledLink {...linkProps} {...props}>
      {children}
    </StyledLink>
  )
}

RouterLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default RouterLink
