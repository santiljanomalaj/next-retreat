import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem, ellipsis } from 'polished'
import { COLORS, space } from 'Theme'
import { Text } from 'components/atoms/Typography'
import { Flex, Box } from 'components/atoms/Layout'
import Modal from 'components/Modal'

const HeaderWrapper = styled(Flex)`
  border-bottom: 1px solid ${COLORS.IRRADIANT_IRIS};
`

const HeaderTextWrapper = styled(Flex)`
  ${ellipsis()}
  flex-direction: column;
`

const TripModal = ({ isOpen, closeModal, children, title, hasCloseButton }) => (
  <Modal
    isOpen={isOpen}
    closeModal={closeModal}
    contentWidth={rem('308px')}
    ariaLabel={title}
    customPadding={space.m}
    hasCloseButton={hasCloseButton}
  >
    <HeaderWrapper alignItems="center" p="m">
      <HeaderTextWrapper flexDirection="column">
        <Text fontSize="l" fontWeight="bold" color={COLORS.SPACE_CADET}>
          {title}
        </Text>
      </HeaderTextWrapper>
    </HeaderWrapper>
    <Box p="m">{children}</Box>
  </Modal>
)

TripModal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

export default TripModal
