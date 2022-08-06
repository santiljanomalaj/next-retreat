import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS } from 'Theme'
import { Text } from 'components/atoms/Typography'
import checkmarkCircleIcon from 'assets/images/svg/checkmark-circle-green.svg'
import envelope from 'assets/images/svg/envelope.svg'
import { Flex } from 'components/atoms/Layout'
import Modal from 'components/Modal'

const StyledFlex = styled(Flex)`
  background-color: ${COLORS.LYNX_WHITE};
`

const TripSuccessFormRequestModal = ({ isOpen, closeModal, title }) => (
  <Modal isOpen={isOpen} closeModal={closeModal} ariaLabel="Ask a Question">
    <Flex flexDirection="column" maxWidth={rem('644px')}>
      <Flex mb="m" mt="l" justifyContent="center">
        <img src={checkmarkCircleIcon} alt="" />
        <Text
          fontWeight="semi_bold"
          fontSize="xxl"
          as="p"
          ml="m"
          textAlign="center"
        >
          {title}
        </Text>
      </Flex>
      <Text
        mb="l"
        as="p"
        fontSize="l"
        color={COLORS.DEEP_RESERVOIR}
        textAlign="center"
      >
        We will get back to you within 24 hours.
      </Text>
      <StyledFlex p="l" flexDirection="column">
        <Flex justifyContent="space-between" alignItems="center" mb="m">
          <Text fontWeight="semi_bold" fontSize="xxl">
            Next step
          </Text>
          <img src={envelope} alt="" />
        </Flex>
        <Text color={COLORS.DEEP_RESERVOIR} fontSize="m">
          We’ve send you a confirmation of your request. Once we are ready to
          answer your questions, we will get back to you via email you provided
        </Text>
      </StyledFlex>
    </Flex>
  </Modal>
)

TripSuccessFormRequestModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

export default TripSuccessFormRequestModal
