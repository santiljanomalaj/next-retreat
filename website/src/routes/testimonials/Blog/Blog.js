import React from 'react'
import styled from 'styled-components'
import { rem } from 'polished'
import {
  fontSizes,
  fontWeights,
  radius,
  space,
  BORDER_WIDTH,
  COLORS,
} from 'Theme'
import Link from 'components/RouterLink'
import { H3 } from 'components/Typography'
import { data as blogPosts } from './data'
import CardSection from '../CardSection'

const StyledCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  max-width: ${rem('357px')};
  height: 100%;
  margin: auto;

  background-color: ${COLORS.WHITE};
`

const Image = styled('img')`
  height: ${rem('250px')};
  width: 100%;
  object-fit: cover;
`

const Tag = styled('span')`
  overflow: hidden;
  display: block;

  line-height: ${rem('20px')};
  padding: 0 ${space.xs};
  margin: ${space.m} ${space.m} 0;
  max-width: calc(100% - ${space.m} * 2);

  white-space: nowrap;
  text-transform: uppercase;
  text-overflow: ellipsis;
  font-weight: ${fontWeights.semi_bold};
  font-size: ${fontSizes.xxs};

  color: ${COLORS.CHUN_LI_BLUE};
  border: ${BORDER_WIDTH} solid ${COLORS.IRRADIANT_IRIS};
  border-bottom-color: ${COLORS.BROTHER_BLUE};
  border-radius: ${radius.s};
`

const ClampedTitle = styled(H3)`
  // https://css-tricks.com/line-clampin/#article-header-id-0
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`

const Blog = () => (
  <CardSection
    linkTo={process.env.GATSBY_BLOG_URL}
    title="More from blog"
    linkLabel="All articles"
    background={COLORS.LYNX_WHITE}
  >
    {blogPosts.map(({ alt, image, tag, title, url }, index) => (
      <StyledCard key={index} to={url}>
        <Image src={image} alt={alt || ''} />
        <Tag>{tag}</Tag>
        <ClampedTitle mt="xs" mb="m" mx="m" fontSize="xxl" fontWeight="bold">
          {title}
        </ClampedTitle>
      </StyledCard>
    ))}
  </CardSection>
)

export default Blog
