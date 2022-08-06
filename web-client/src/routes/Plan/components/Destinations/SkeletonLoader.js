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
      speed="2"
      width="548"
      viewBox="0 0 548 370"
      backgroundColor={COLORS.IRRADIANT_IRIS}
      foregroundColor={COLORS.SUPER_SILVER}
    >
      <rect x="18" y="343" rx="5" ry="5" width="25" height="10" />
      <rect x="461" y="16" rx="10" ry="10" width="71" height="16" />
      <rect x="16" y="221" rx="10" ry="10" width="90" height="13" />
      <rect x="0" y="1" rx="0" ry="0" width="548" height="200" />
      <rect x="16" y="252" rx="5" ry="5" width="402" height="10" />
      <rect x="16" y="272" rx="5" ry="5" width="325" height="10" />
      <rect x="410" y="217" rx="10" ry="10" width="122" height="18" />
      <circle cx="30" cy="321" r="14" />
      <circle cx="74" cy="321" r="14" />
      <rect x="62" y="343" rx="5" ry="5" width="25" height="10" />
      <circle cx="118" cy="321" r="14" />
      <rect x="106" y="343" rx="5" ry="5" width="25" height="10" />
      <circle cx="162" cy="321" r="14" />
      <rect x="150" y="343" rx="5" ry="5" width="25" height="10" />
      <circle cx="206" cy="321" r="14" />
      <rect x="194" y="343" rx="5" ry="5" width="25" height="10" />
      <circle cx="250" cy="321" r="14" />
      <rect x="238" y="343" rx="5" ry="5" width="25" height="10" />
      <circle cx="294" cy="321" r="14" />
      <rect x="282" y="343" rx="5" ry="5" width="25" height="10" />
      <circle cx="338" cy="321" r="14" />
      <rect x="326" y="343" rx="5" ry="5" width="25" height="10" />
      <circle cx="382" cy="321" r="14" />
      <rect x="370" y="343" rx="5" ry="5" width="25" height="10" />
      <circle cx="426" cy="321" r="14" />
      <rect x="414" y="343" rx="5" ry="5" width="25" height="10" />
      <circle cx="470" cy="321" r="14" />
      <rect x="458" y="343" rx="5" ry="5" width="25" height="10" />
      <circle cx="514" cy="321" r="14" />
      <rect x="502" y="343" rx="5" ry="5" width="25" height="10" />
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
