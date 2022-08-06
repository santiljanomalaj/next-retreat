import React from 'react'
import ContentLoader from 'react-content-loader'
import { rem } from 'polished'
import { COLORS } from 'Theme'
import { TOPBAR_HEIGHT } from 'constants/style'
import { Box, Flex } from 'components/atoms/Layout'
import { ReactComponent as MapSVG } from 'assets/images/svg/skeleton-map.svg'

const SkeletonCard = () => (
  <Flex width="100%" minHeight={rem(230)} bg={COLORS.LYNX_WHITE} mb="m">
    <ContentLoader
      speed={2}
      width="640"
      viewBox="0 0 640 232"
      backgroundColor={COLORS.IRRADIANT_IRIS}
      foregroundColor={COLORS.SUPER_SILVER}
    >
      <rect x="330" y="17" rx="10" ry="10" width="37" height="17" />
      <rect x="371" y="17" rx="10" ry="10" width="89" height="17" />
      <rect x="590" y="17" rx="10" ry="10" width="37" height="25" />
      <rect x="331" y="92" rx="5" ry="5" width="146" height="10" />
      <rect x="331" y="52" rx="10" ry="10" width="220" height="20" />
      <rect x="16" y="16" rx="0" ry="0" width="298" height="200" />
      <rect x="331" y="109" rx="5" ry="5" width="118" height="10" />
      <rect x="331" y="127" rx="5" ry="5" width="93" height="10" />
      <rect x="331" y="199" rx="10" ry="10" width="146" height="17" />
      <rect x="552" y="199" rx="10" ry="10" width="75" height="17" />
    </ContentLoader>
  </Flex>
)

export const SkeletonList = () => (
  <Flex flexDirection="column" mt="s">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </Flex>
)

export const SkeletonMap = () => (
  <Box position="sticky" top={TOPBAR_HEIGHT} bg={COLORS.LYNX_WHITE}>
    <MapSVG style={{ width: '100%' }} />
  </Box>
)

export const SkeletonStep = () => (
  <Flex width="100%">
    <ContentLoader
      speed="2"
      height="23"
      width="272"
      viewBox="0 0 272 23"
      backgroundColor={COLORS.IRRADIANT_IRIS}
      foregroundColor={COLORS.SUPER_SILVER}
    >
      <rect width="272" height="23" rx="10" />
    </ContentLoader>
  </Flex>
)
