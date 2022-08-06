import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useModal } from 'components/Modal'
import { maxWidthStyle } from 'components/mixins'
import { Box } from 'components/Layout'
import App from 'App'
import Footer from 'routes/components/Footer'
import Header from 'routes/components/Header'
import GetAccessModal from './GetAccessModal'

const Content = styled('div')`
  z-index: 0;
  position: relative;

  ${maxWidthStyle}
`

const FooterWrapper = styled('div')`
  ${maxWidthStyle}
`

const GenericPage = ({
  children,
  openModal,
  closeModal,
  isModalOpen,
  headerBgColor,
  hasFooterBorder,
  headerContentColor,
}) => {
  const modalValues = useModal()
  return (
    <App>
      <Header
        bgColor={headerBgColor}
        contentColor={headerContentColor}
        openModal={openModal || modalValues.openModal}
      />
      <Box overflow="hidden">
        <Content>{children}</Content>
      </Box>
      <FooterWrapper>
        <Footer hasBorder={hasFooterBorder} />
      </FooterWrapper>
      <GetAccessModal
        isOpen={isModalOpen !== undefined ? isModalOpen : modalValues.isOpen}
        closeModal={closeModal || modalValues.closeModal}
        ariaLabel="Get early modal"
      />
    </App>
  )
}

GenericPage.propTypes = {
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  isModalOpen: PropTypes.bool,
  headerBgColor: PropTypes.string,
  hasFooterBorder: PropTypes.bool,
  headerContentColor: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default GenericPage
