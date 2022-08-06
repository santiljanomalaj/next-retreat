import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS, space, radius } from 'Theme'
import { Flex, Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Button from 'components/atoms/Button'
import envelopeIcon from 'assets/images/envelop.png'
import specialistImage from 'assets/images/specialist.png'

const Checkmark = () => (
  <svg viewBox="0 0 12 9" width="12" height="9">
    <path
      fill={COLORS.WHITE}
      d="M4.25 9a.75.75 0 01-.53-.22L.19 5.25l1.06-1.06 3 3 6.5-6.5 1.06 1.06-7.03 7.03a.75.75 0 01-.53.22z"
    />
  </svg>
)

const StyledImage = styled('img')`
  width: ${rem(46)};

  object-fit: contain;
`

const BUBBLE_SIZE = rem(26)

const WrapperFlex = styled(Flex)`
  align-items: center;
  justify-content: center;
  height: ${BUBBLE_SIZE};
  width: ${BUBBLE_SIZE};
  min-width: ${BUBBLE_SIZE};
  border-radius: ${radius.circle};
  background-color: ${COLORS.GOUDA_GOLD};
`

const DecorativeLine = styled('div')`
  height: 1px;
  width: 100%;
  background-color: ${COLORS.IRRADIANT_IRIS};
`

const IMAGE_SIZE = rem(64)

const SpecialistImage = styled('div')`
  height: ${IMAGE_SIZE};
  min-width: ${IMAGE_SIZE};
  border-radius: ${radius.circle};
  background: url("${specialistImage}") center / cover no-repeat;
`

const StyledBox = styled(Box)`
  border-radius: ${radius.m};
  background-color: ${COLORS.LYNX_WHITE};
  margin-bottom: ${space.m};
  padding: calc(${space.m} - ${space.xs});
`

const StyledButton = styled(Button.Secondary)`
  text-decoration: none;
`

const BookingSummary = ({ bookingNumber }) => (
  <div>
    <Flex alignItems="baseline" mb="l">
      <WrapperFlex>
        <Checkmark />
      </WrapperFlex>
      <Box ml="m">
        <Text
          as="p"
          fontSize="xxl"
          fontWeight="semi_bold"
          color={COLORS.SPACE_CADET}
        >
          Your booking request was successfully sent!
        </Text>
        <Text as="p" fontSize="l" color={COLORS.DEEP_RESERVOIR} mt="s">
          Your reservation number is{' '}
          <Text fontWeight="semi_bold" color={COLORS.SPACE_CADET}>
            {bookingNumber}
          </Text>
          . Your stay is not confirmed yet.
        </Text>
      </Box>
    </Flex>
    <Box bg={COLORS.LYNX_WHITE} mb="l" p="l">
      <Flex justifyContent="space-between" mb="m">
        <Text fontSize="xxl" fontWeight="semi_bold" color={COLORS.SPACE_CADET}>
          Next step
        </Text>
        <StyledImage src={envelopeIcon} />
      </Flex>
      <Text fontSize="l" fontWeight="semi_bold" color={COLORS.SPACE_CADET}>
        Payment – check your mailbox for the invoice
      </Text>
      <Text as="p" fontSize="m" color={COLORS.DEEP_RESERVOIR} mt="s">
        In order to finish your booking and secure this venue for your team on
        selected dates, you need to make the payment. We have sent the invoice
        to your email with payment instructions.
      </Text>
    </Box>
    <DecorativeLine />
    <Box mt="l" mb="l">
      <Text fontSize="xxl" fontWeight="semi_bold" color={COLORS.SPACE_CADET}>
        Meet your Retreat Specialist
      </Text>
    </Box>
    <Flex>
      <SpecialistImage />
      <Box ml="m">
        <StyledBox>
          <Text
            as="p"
            fontSize="m"
            color={COLORS.DEEP_RESERVOIR}
            textAlign="justify"
          >
            <span role="img" aria-label="hello">
              👋
            </span>{' '}
            Hi,
            <br />
            <br />
            I am Petra and I will be your dedicated Retreat Specialist. :)
            <br />
            <br />
            I’ll be assisting you throughout the whole journey – booking process
            (incl. adding/removing team members & other changes), helping with
            trip planning and arranging any services you may want.
            <br />
            <br />
            Since the availability of venue can change, let’s start by
            finalizing the reservation and securing the venue for you.
            <br />
            <br />
            Please have a look at your email and let me know if I can assist
            with payment or answer any questions.
          </Text>
        </StyledBox>
        <StyledButton as="a" href="mailto:support@nextretreat.com">
          Reply
        </StyledButton>
      </Box>
    </Flex>
  </div>
)

BookingSummary.propTypes = {
  bookingNumber: PropTypes.number.isRequired,
}

export default BookingSummary
