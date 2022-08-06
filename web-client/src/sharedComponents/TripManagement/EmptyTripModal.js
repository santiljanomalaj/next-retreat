import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import TripModal from './TripModal'
import { COLORS } from '../../Theme'
import { Flex, Box } from 'components/atoms/Layout'
import { Text } from '../../components/atoms/Typography'
import Button from "../../components/atoms/Button"
import heartPointerIcon from "../../assets/images/svg/heart-pointer.svg"

const EmptyTripModal = ({isOpen, closeModal}) => {
  const history = useHistory()

  return (
    <TripModal title="Company Trip" isOpen={isOpen} closeModal={closeModal}>
      <Flex flexDirection="column" alignItems="center" pt="m">
        <Text fontSize="l" fontWeight="bold" color={COLORS.SPACE_CADET} mb="s">
          This trip is Empty
        </Text>
        <Text fontSize="s" color={COLORS.SPACE_CADET}>
          Add your venues to the trip by clicking
        </Text>
        <Text fontSize="s" color={COLORS.SPACE_CADET} mb="m">
          the heart by the venue detail.
        </Text>
        <Box mb="m">
          <img src={heartPointerIcon} alt="" />
        </Box>
        <Button.Primary
          isBlock
          onClick={() => {
            closeModal()
            history.push('/plan')
          }}
        >
          Start planning
        </Button.Primary>
      </Flex>
    </TripModal>
  )
}

EmptyTripModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
}

export default EmptyTripModal