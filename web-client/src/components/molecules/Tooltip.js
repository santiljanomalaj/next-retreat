import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { useDebouncedCallback } from 'use-debounce'
import { fontSizes, radius, space, COLORS, BOXSHADOWS } from 'Theme'
import { Flex } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Popover from 'components/Popover'

const TooltipRef = React.forwardRef((props, ref) => (
  <Flex {...props} ref={ref} style={{ cursor: 'pointer' }} />
))

const Info = ({ fill, iconSize }) => (
  <svg
    width={iconSize || 16}
    height={iconSize || 16}
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM9 12H7V7H9V12ZM8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6Z"
      fill={fill || COLORS.CHUN_LI_BLUE}
    />
  </svg>
)

Info.propTypes = {
  fill: PropTypes.string,
  iconSize: PropTypes.number,
}

const Content = styled(Flex)`
  overflow: hidden;

  justify-content: center;

  width: max-content;
  margin: ${space.s};
  min-width: ${rem(100)};
  max-width: ${({ maxWidth }) => maxWidth || rem(250)};

  background-color: ${COLORS.WHITE};
  border-radius: ${radius.m};
  box-shadow: ${BOXSHADOWS.TOOLTIP};

  ${({ hasText }) => !hasText && `padding: ${space.s};`}
`

const StyledText = styled(Text)`
  width: 100%;
  padding: ${space.s};

  font-size: ${fontSizes.xs};
  line-height: 1.2;
  white-space: initial;
  text-align: ${({ textAlign }) => textAlign || 'center'};

  background-color: ${COLORS.SPACE_CADET};
  color: ${COLORS.WHITE};
`

const LabelText = styled(Text)`
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
    }
  }
`

const Tooltip = ({
  text,
  label,
  onClick,
  maxWidth,
  position,
  iconFill,
  iconSize,
  textAlign,
  contentComp,
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = React.useState(false)
  const [onHover] = useDebouncedCallback((value) => {
    setIsTooltipVisible(value)
  }, 200)

  return (
    <Popover
      placement="right"
      isVisible={isTooltipVisible}
      targetComp={
        <TooltipRef
          width="fit-content"
          alignItems="center"
          onClick={onClick}
          onMouseEnter={() => {
            onHover(true)
          }}
          onMouseLeave={() => {
            onHover(false)
          }}
        >
          {label && (
            <LabelText fontSize="xxs" color={iconFill} mr="s">
              {label}
            </LabelText>
          )}
          <Info fill={iconFill} iconSize={iconSize} />
        </TooltipRef>
      }
      zIndex={10}
    >
      {isTooltipVisible && (
        <Content
          onMouseEnter={() => {
            onHover(true)
          }}
          onMouseLeave={() => {
            onHover(false)
          }}
          hasText={text}
          position={position}
          maxWidth={maxWidth}
        >
          {contentComp || <StyledText textAlign={textAlign}>{text}</StyledText>}
        </Content>
      )}
    </Popover>
  )
}

Tooltip.propTypes = {
  text: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  iconSize: PropTypes.number,
  iconFill: PropTypes.string,
  position: PropTypes.string,
  maxWidth: PropTypes.string,
  contentComp: PropTypes.node,
  textAlign: PropTypes.string,
}

export default Tooltip
