import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TOPBAR_HEIGHT } from 'constants/style'
import Footer from './Footer'
import Header from './Header'

const Content = styled('main')`
  z-index: 0;
  position: relative;

  min-height: calc(var(--nr-100vh, 100vh) - ${TOPBAR_HEIGHT});
`

const Page = ({ children, loginRequired, goToPlan}) => (
  <>
    <Header loginRequired={loginRequired} goToPlan={goToPlan}/>
    <Content>{children}</Content>
    <Footer />
  </>
)

Page.propTypes = {
  children: PropTypes.node.isRequired,
  loginRequired: PropTypes.bool
}

export default Page
