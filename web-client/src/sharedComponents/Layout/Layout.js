import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { mq, space } from 'Theme'

export const LIST_PADDING = space.m

const StyledLayout = styled('div')`
  display: flex;
`

const ListWrapper = styled('div')`
  min-width: 0;
  flex: ${({ ratio }) => ratio};

  ${mq.from.tablet`
    width: 50%;
  `}

  ${mq.from.desktop`
    max-width: calc(
      ${({ contentWidth }) => contentWidth} + ${rem('144px')}
    );
  `}
`

const List = styled('div')`
  width: 100%;
  margin-left: auto;
  padding: 0 ${LIST_PADDING} ${LIST_PADDING} ${LIST_PADDING};

  ${mq.from.desktop`
    max-width: ${({ contentWidth }) => contentWidth};
  `}
`

const Map = styled('aside')`
  flex: 1;

  ${mq.to.tablet`
    ${({ isMapOpen }) => !isMapOpen && `display: none;`}
  `}
`

const Layout = ({
  ratio,
  isMapOpen,
  mapContent,
  listContent,
  contentWidth,
}) => (
  <StyledLayout>
    <ListWrapper ratio={ratio} contentWidth={contentWidth}>
      {React.cloneElement(listContent, { contentWidth })}
    </ListWrapper>
    {React.cloneElement(mapContent, { isMapOpen })}
  </StyledLayout>
)

Layout.defaultProps = {
  contentWidth: rem('580px'),
  ratio: 1,
}

Layout.propTypes = {
  ratio: PropTypes.number,
  isMapOpen: PropTypes.bool,
  contentWidth: PropTypes.string,
  mapContent: PropTypes.node.isRequired,
  listContent: PropTypes.node.isRequired,
}

Layout.List = List
Layout.Map = Map

export default Layout
