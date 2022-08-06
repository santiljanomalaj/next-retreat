import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS, space } from 'Theme'
import { Flex, Grid } from 'components/Layout'
import { Text } from 'components/Typography'
import bonfireIcon from 'images/svg/feature/bonfire-icon.svg'
import caseIcon from 'images/svg/feature/case-icon.svg'
import chairIcon from 'images/svg/feature/chair-icon.svg'
import deskIcon from 'images/svg/feature/desk-icon.svg'
import houseIcon from 'images/svg/feature/house-icon.svg'
import laptopIcon from 'images/svg/feature/laptop-icon.svg'

const Icon = styled('img')`
  width: ${rem(46)};
  margin-bottom: ${space.m};
`

const IconText = ({ src, label }) => (
  <Flex flexDirection="column" alignItems="center">
    <Icon src={src} alt="" />
    <Text
      textAlign="center"
      fontSize="m"
      fontWeight="semi_bold"
      color={COLORS.SPACE_CADET}
    >
      {label}
    </Text>
  </Flex>
)

IconText.propTypes = {
  src: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

const IconTextSection = () => (
  <Grid
    gridTemplateColumns={{
      mobile: `1fr 1fr`,
      tablet: `1fr 1fr 1fr 1fr 1fr 1fr`,
    }}
    gridGap="m"
  >
    <IconText src={bonfireIcon} label="Team Building" />
    <IconText src={houseIcon} label="Team Retreat" />
    <IconText src={deskIcon} label="Team Offsite" />
    <IconText src={chairIcon} label="Corporate Event" />
    <IconText src={caseIcon} label="Business Meetup" />
    <IconText src={laptopIcon} label="Workation" />
  </Grid>
)

export default IconTextSection
