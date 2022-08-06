import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { rem, triangle } from 'polished'
import OutsideClickHandler from 'react-outside-click-handler'
import Media from 'components/Media'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { mq, radius, space, BOXSHADOWS, COLORS } from 'Theme'
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
        width: ['left', 'right'].includes(placement)
          ? ARROW_HEIGHT
          : rem('18px'),
        height: ['left', 'right'].includes(placement)
          ? rem('18px')
          : ARROW_HEIGHT,
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
  width: min-content;
  min-width: ${({ customMinWidth }) => customMinWidth || rem('248px')};
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
`

const Content = styled('div')`
  overflow-y: auto;
  overflow-x: hidden;

  ${({ hasPadding }) =>
    hasPadding &&
    `
      padding: ${PADDING};
    `}
`

const Footer = styled('div')`
  position: relative;

  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: ${rem('56px')};
  padding: 0 ${space.s};

  background-color: ${COLORS.LYNX_WHITE};
  border-radius: 0 0 ${radius.m} ${radius.m};
  box-shadow: ${BOXSHADOWS.LIGHT};
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

const Filter = ({
  children,
  label,
  modalLabel = label,
  clearLabel,
  placement,
  isChanged,
  isOpen,
  onOpen,
  onClear,
  onCancel,
  onApply,
  hasFooter,
  hasPadding,
  targetComp: TargetComp,
  value,
  isMobile,
  isApplyDisabled,
  isDisabled,
  customMinWidth,
}) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(isOpen)
  const contentRef = React.useRef(null)

  React.useEffect(() => {
    if (value) {
      setIsFilterOpen(false)
    }
  }, [value])

  React.useEffect(() => {
    if (isFilterOpen && isMobile) {
      disableBodyScroll(contentRef.current)
    } else {
      clearAllBodyScrollLocks()
    }
  }, [isFilterOpen, isMobile])

  return (
    <Popover
      targetComp={
        <TargetComp
          isActive={isFilterOpen}
          isOutlined={isChanged}
          disabled={isDisabled}
          onClick={() => {
            if (onOpen) {
              onOpen()
            }
            setIsFilterOpen((prevIsOpen) => !prevIsOpen)
          }}
        >
          {label}
        </TargetComp>
      }
      arrowStyle={arrowStyle}
      placement={placement}
      isVisible={isFilterOpen}
      popoverStyle={isMobile ? mobileOverrideStyle : undefined}
      zIndex={mobileOverrideStyle.zIndex}
    >
      <OutsideClickHandler
        disabled={!isFilterOpen}
        onOutsideClick={() => {
          if (onCancel) {
            onCancel()
          }
          setIsFilterOpen(false)
        }}
      >
        <Card customMinWidth={customMinWidth}>
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
                    setIsFilterOpen(false)
                  }}
                >
                  <img src={xmarkIcon} alt="" />
                </CloseButton>
              </Header>
            )}
            <Content hasPadding={hasPadding} ref={contentRef}>
              {children}
            </Content>
          </Body>
          {hasFooter && (
            <Footer>
              <Button.Tertiary
                fontSize="s"
                onClick={() => {
                  if (onClear) {
                    onClear()
                  }
                }}
              >
                {clearLabel}
              </Button.Tertiary>
              <Button.Primary
                disabled={isApplyDisabled}
                onClick={() => {
                  if (onApply) {
                    onApply()
                  }
                  setIsFilterOpen(false)
                }}
              >
                Apply
              </Button.Primary>
            </Footer>
          )}
        </Card>
      </OutsideClickHandler>
    </Popover>
  )
}

Filter.defaultProps = {
  isOpen: false,
  hasFooter: true,
  hasPadding: true,
  targetComp: Button.Pill,
  clearLabel: 'Clear',
  isDisabled: false,
}

Filter.propTypes = {
  children: PropTypes.node,
  label: PropTypes.node.isRequired,
  modalLabel: PropTypes.node,
  clearLabel: PropTypes.string,
  placement: PropTypes.string,
  isChanged: PropTypes.bool,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClear: PropTypes.func,
  onCancel: PropTypes.func,
  onApply: PropTypes.func,
  hasFooter: PropTypes.bool,
  hasPadding: PropTypes.bool,
  targetComp: PropTypes.object,
  value: PropTypes.any,
  isMobile: PropTypes.bool,
  isApplyDisabled: PropTypes.bool,
  isDisabled: PropTypes.bool,
  customMinWidth: PropTypes.string,
}

const ResponsiveFilter = (props) => (
  <Media>{(matches) => <Filter isMobile={matches.mobile} {...props} />}</Media>
)

export default ResponsiveFilter
