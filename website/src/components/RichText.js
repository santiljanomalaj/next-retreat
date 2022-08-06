import styled from 'styled-components'
import { fontSizes, fontWeights, space, COLORS } from 'Theme'
import { Box } from 'components/Layout'

const RichText = styled(Box)`
  h2,
  h3,
  h4 {
    font-weight: ${fontWeights.semi_bold};
  }

  h3,
  h4 {
    margin-top: ${space.l};

    font-size: ${fontSizes.xxl};
  }

  h4 {
    margin-bottom: 0;
  }

  h3,
  h4,
  p,
  li {
    font-size: ${fontSizes.l};
  }

  p {
    line-height: 1.625;
  }

  a {
    text-decoration: none;

    color: ${COLORS.CHUN_LI_BLUE};

    &:hover {
      text-decoration: underline;
    }
  }

  hr {
    margin: ${space.l} 0;

    border: 0;
    border-top: 1px solid ${COLORS.IRRADIANT_IRIS};
  }

  ol {
    list-style-position: inside;
  }

  > * {
    margin: ${space.m} 0;
  }

  h4 + p {
    margin-top: 0;
  }
`

export default RichText
