import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { space, COLORS } from 'Theme'
import { Text } from 'components/atoms/Typography'
import { Box } from 'components/atoms/Layout'
import commentBubbleIcon from 'assets/images/svg/comment-bubble.svg'
import lightbulbIcon from 'assets/images/svg/lightbulb.svg'
import paperAirplaneIcon from 'assets/images/svg/paper-airplane.svg'
import telephoneIcon from 'assets/images/svg/telephone.svg'

const Menu = styled('nav')`
  display: flex;
  flex-direction: column;

  padding-bottom: ${space.s};
`

const MenuItem = styled('a')`
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

const Icon = styled('img')`
  height: ${rem('16px')};
  padding-right: ${space.m};
`

const SupportMenu = ({ requestButtonComp, accountButtonComp }) => (
  <Menu>
    <Text px="m" py="s" fontSize="s" color={COLORS.DEEP_RESERVOIR}>
      Choose your support
    </Text>
    <MenuItem href={`https://www.nextretreat.com/how-it-works`} target="_blank">
      <Icon src={lightbulbIcon} alt="" />
      How it works
    </MenuItem>
    <MenuItem
      as="button"
      type="button"
      onClick={() => {
        if (window.drift) {
          window.drift.api.openChat();
        }
      }}
    >
      <Icon src={commentBubbleIcon} alt="" />
      Chat
    </MenuItem>
    <MenuItem href="tel:+443308180703">
      <Icon src={telephoneIcon} alt="" />
      +44 330 818 0703
    </MenuItem>
    <MenuItem href="mailto:support@nextretreat.com">
      <Icon src={paperAirplaneIcon} alt="" />
      Email
    </MenuItem>
    {requestButtonComp && (
      <Box mx="m" my="s">
        {requestButtonComp}
      </Box>
    )}
    {accountButtonComp && (
      <Box mx="m" my="s">
        {accountButtonComp}
      </Box>
    )}
  </Menu>
)

SupportMenu.propTypes = {
  requestButtonComp: PropTypes.node,
  accountButtonComp: PropTypes.node,
}

export default SupportMenu
