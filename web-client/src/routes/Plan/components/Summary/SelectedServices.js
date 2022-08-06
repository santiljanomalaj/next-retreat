import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { COLORS, space } from 'Theme'
import { Flex } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import { ReactComponent as CheckmarkIcon } from 'assets/images/svg/checkmark-summary.svg'
import { ReactComponent as CrossIcon } from 'assets/images/svg/cross-summary.svg'

const IconTextWrapper = styled('div')`
  > div:not(:first-child) {
    margin-top: ${space.s};
  }
`

const IconText = ({ isOrdered, title }) => (
  <Flex alignItems="center">
    {isOrdered ? <CheckmarkIcon /> : <CrossIcon />}
    <Text
      as="p"
      fontSize="l"
      color={isOrdered ? COLORS.DEEP_RESERVOIR : COLORS.BLUEBERRY_SODA}
      ml="m"
    >
      {title}
    </Text>
  </Flex>
)

IconText.propTypes = {
  isOrdered: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

const SelectedServices = ({ note, services }) => (
  <div>
    {note && (
      <div>
        <Text
          as="p"
          fontSize="l"
          fontWeight="semi_bold"
          color={COLORS.SPACE_CADET}
          mb="s"
        >
          Your note:
        </Text>
        <Text
          as="p"
          fontSize="l"
          fontStyle="italic"
          fontWeight="light"
          color={COLORS.DEEP_RESERVOIR}
          mb="l"
        >
          {`"${note}"`}
        </Text>
      </div>
    )}

    <Text
      as="p"
      fontSize="l"
      fontWeight="semi_bold"
      color={COLORS.SPACE_CADET}
      mb="s"
    >
      Requested assistance with:
    </Text>
    <IconTextWrapper>
      <IconText title="Wifi dongles" isOrdered={services.includes('WIFI')} />
      <IconText title="Insurance" isOrdered={services.includes('INSURANCE')} />
      <IconText
        title="Activities"
        isOrdered={services.includes('ACTIVITIES')}
      />
      <IconText
        title="Transportation"
        isOrdered={services.includes('TRANSPORTATION')}
      />
      <IconText title="Food" isOrdered={services.includes('FOOD')} />
      <IconText
        title="Other requirements"
        isOrdered={services.includes('OTHER')}
      />
    </IconTextWrapper>
  </div>
)

SelectedServices.propTypes = {
  note: PropTypes.string.isRequired,
  services: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default SelectedServices
