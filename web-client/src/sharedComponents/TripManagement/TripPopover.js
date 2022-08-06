import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { rem, triangle } from 'polished'
import OutsideClickHandler from 'react-outside-click-handler'
import Media from 'components/Media'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { mq, radius, space, COLORS } from 'Theme'
import Button from 'components/atoms/Button'
import { Text } from 'components/atoms/Typography'
import Popover from 'components/Popover'
import xmarkIcon from 'assets/images/svg/xmark.svg'

const filterMQ = mq.to.tablet

const INVERSE_PLACEMENT_MAP = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

const ARROW_HEIGHT = rem('8px')
const CLOSE_BUTTON_SIZE = rem('18px')
export const PADDING = space.m

const arrowStyle = css`
  position: absolute;

  &[data-placement*='bottom'] {
    top: 0;
    left: 0;
  }

  &[data-placement*='top'] {
    bottom: 0;
    left: 0;
  }

  &[data-placement*='right'] {
    left: 0;
  }

  &[data-placement*='left'] {
    right: 0;
  }

  &::before,
  &::after {
    content: '';
    display: block;

    ${({ placement }) =>
      placement &&
      triangle({
        pointingDirection: INVERSE_PLACEMENT_MAP[placement],
        width: rem('18px'),
        height: ARROW_HEIGHT,
        foregroundColor: COLORS.WHITE,
      })}
  }

  &::before {
    z-index: -1;
    position: absolute;

    filter: drop-shadow(0px 2px 8px rgba(66, 149, 165, 0.2))
      drop-shadow(0px 2px 2px rgba(66, 149, 165, 0.25))
      drop-shadow(0px -2px 2px rgba(66, 149, 165, 0.25));
  }

  ${filterMQ`
    display: none;
  `}
`

const Card = styled('div')`
  width: ${rem('308px')};
  margin: ${ARROW_HEIGHT};

  background-color: ${COLORS.WHITE};
  box-shadow: 0px 2px 8px rgba(66, 149, 165, 0.2),
    0px 2px 2px rgba(66, 149, 165, 0.25), 0px -2px 2px rgba(66, 149, 165, 0.25);
  border-radius: ${radius.m};

  ${filterMQ`
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    height: var(--nr-100vh, 100vh);
    width: auto;
    min-width: none;
    margin: 0;

    box-shadow: none;
    border-radius: none;
  `}
`

const Header = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: ${PADDING};
  padding-bottom: ${space.s};
`

const Body = styled('div')`
  display: flex;
  flex-direction: column;

  min-height: 0;
  flex: 1;
`

const Content = styled('div')`
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;

  ${({ hasPadding }) =>
    hasPadding &&
    `
      padding: ${PADDING};
    `}
`

const CloseButton = styled('button')`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: ${CLOSE_BUTTON_SIZE};
  width: ${CLOSE_BUTTON_SIZE};
`

const mobileOverrideStyle = {
  zIndex: 1,
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
}

const TripPopover = ({
  children,
  label,
  modalLabel = label,
  placement,
  isChanged,
  isOpen,
  onOpen,
  onCancel,
  targetComp: TargetComp,
  value,
  isMobile,
  preventOutsideClick,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(isOpen)
  const contentRef = React.useRef(null)

  React.useEffect(() => {
    if (value) {
      setIsPopoverOpen(false)
    }
  }, [value])

  React.useEffect(() => {
    if (isPopoverOpen && isMobile) {
      disableBodyScroll(contentRef.current)
    } else {
      clearAllBodyScrollLocks()
    }
  }, [isPopoverOpen, isMobile])

  return (
    <Popover
      targetComp={
        <TargetComp
          isActive={isPopoverOpen}
          isOutlined={isChanged}
          onClick={() => {
            if (onOpen) {
              onOpen()
            }
            setIsPopoverOpen((prevIsOpen) => !prevIsOpen)
          }}
        >
          {label}
        </TargetComp>
      }
      arrowStyle={arrowStyle}
      placement={placement}
      isVisible={isPopoverOpen}
      popoverStyle={isMobile ? mobileOverrideStyle : undefined}
      zIndex={mobileOverrideStyle.zIndex}
    >
      <OutsideClickHandler
        disabled={!isPopoverOpen}
        onOutsideClick={() => {
          if (!preventOutsideClick) {
            if (onCancel) {
              onCancel()
            }
            setIsPopoverOpen(false)
          }
        }}
      >
        <Card>
          <Body>
            {isMobile && (
              <Header>
                <Text fontSize="xl" fontWeight="semi_bold">
                  {modalLabel}
                </Text>
                <CloseButton
                  type="button"
                  onClick={() => {
                    if (onCancel) {
                      onCancel()
                    }
                    setIsPopoverOpen(false)
                  }}
                >
                  <img src={xmarkIcon} alt="" />
                </CloseButton>
              </Header>
            )}
            <Content ref={contentRef}>{children}</Content>
          </Body>
        </Card>
      </OutsideClickHandler>
    </Popover>
  )
}

TripPopover.defaultProps = {
  isOpen: false,
  targetComp: Button.Pill,
}

TripPopover.propTypes = {
  children: PropTypes.node,
  label: PropTypes.node.isRequired,
  modalLabel: PropTypes.node,
  placement: PropTypes.string,
  isChanged: PropTypes.bool,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onCancel: PropTypes.func,
  targetComp: PropTypes.object,
  value: PropTypes.any,
  isMobile: PropTypes.bool,
  preventOutsideClick: PropTypes.bool,
}

const ResponsiveFilter = (props) => (
  <Media>
    {(matches) => <TripPopover isMobile={matches.mobile} {...props} />}
  </Media>
)

export default ResponsiveFilter
