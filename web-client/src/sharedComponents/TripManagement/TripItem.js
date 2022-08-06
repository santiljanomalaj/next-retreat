import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem, ellipsis } from 'polished'
import { COLORS, mq } from 'Theme'
import { Text } from 'components/atoms/Typography'
import { Flex, Box } from 'components/atoms/Layout'

const StyledImage = styled.img`
  width: ${rem('50px')};
  height: ${rem('50px')};
  border-radius: 50%;
`

const ActionIconWrapper = styled(Flex)`
  margin-left: auto;
  ${({ onClick, isDisabled }) =>
    onClick && `cursor: ${isDisabled ? 'not-allowed' : 'pointer'};`}
  ${mq.from.tablet`
    visibility: hidden;
  `}
`

const TripItemWrapper = styled(Flex)`
  flex: 1;
  max-height: ${rem('66px')};
  ${({ onClick, isDisabled }) =>
    onClick && `cursor: ${isDisabled ? 'not-allowed' : 'pointer'};`}
  @media (hover: hover) {
    &:hover {
      ${({ isDisabled }) =>
        !isDisabled && `background-color: ${COLORS.LYNX_WHITE};`}
    }
    &:hover ${ActionIconWrapper} {
      visibility: visible;
    }
  }
`

const TripItemTextWrapper = styled(Flex)`
  ${ellipsis()}
  flex-direction: column;
`

const TripItem = ({
  onClick,
  primaryText,
  secondaryText,
  imageSrc,
  actionIconSrc,
  onActionIconClick,
  hasPadding,
  isDisabled,
  primaryFlag
}) => (
  <TripItemWrapper
    p={hasPadding && 's'}
    pr={hasPadding ? 'm' : 's'}
    alignItems="center"
    onClick={isDisabled ? undefined : onClick}
    isDisabled={isDisabled}
  >
    <Box>
      <StyledImage src={imageSrc} alt="" />
    </Box>
    <TripItemTextWrapper flexDirection="column" mr="m" ml="s">
      <Text
        fontSize="m"
        color={isDisabled ? COLORS.BROTHER_BLUE : COLORS.SPACE_CADET}
      >
        {primaryText}
      </Text>
      {secondaryText && (
        <Text fontSize="s" color={COLORS.BROTHER_BLUE} display="block">
          {secondaryText}
        </Text>
      )}
    </TripItemTextWrapper>
    {actionIconSrc && (
      <ActionIconWrapper
        ml="auto"
        onClick={onActionIconClick}
        isDisabled={isDisabled}
      >
        <img src={actionIconSrc} alt="" />
      </ActionIconWrapper>
    )}
  </TripItemWrapper>
)

TripItem.defaultProps = {
  hasPadding: true,
  isDisabled: false,
}

TripItem.propTypes = {
  onClick: PropTypes.func,
  primaryText: PropTypes.node.isRequired,
  secondaryText: PropTypes.node,
  imageSrc: PropTypes.node.isRequired,
  actionIconSrc: PropTypes.node,
  onActionIconClick: PropTypes.func,
  hasPadding: PropTypes.bool,
  isDisabled: PropTypes.bool,
}

export default TripItem
