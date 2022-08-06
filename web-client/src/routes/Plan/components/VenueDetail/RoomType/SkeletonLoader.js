import React from 'react'
import ContentLoader from 'react-content-loader'
import { COLORS } from 'Theme'
import { Box } from 'components/atoms/Layout'
import Media from 'components/Media'

const desktop = (
  <Box bg={COLORS.LYNX_WHITE} mb="m">
    <ContentLoader
      speed={2}
      width="100%"
      height={149}
      viewBox="0 0 739 149"
      preserveAspectRatio="xMinYMin slice"
      backgroundColor={COLORS.IRRADIANT_IRIS}
      foregroundColor={COLORS.SUPER_SILVER}
    >
      <rect x="172" y="20" rx="6" ry="6" width="152" height="13" />
      <rect x="16" y="16" rx="0" ry="0" width="140" height="90" />
      <rect x="172" y="48" rx="6" ry="6" width="334" height="10" />
      <rect x="172" y="68" rx="6" ry="6" width="283" height="10" />
      <rect x="172" y="101" rx="6" ry="6" width="142" height="10" />
      <rect x="662" y="114" rx="10" ry="10" width="61" height="18" />
      <rect x="448" y="114" rx="10" ry="10" width="31" height="18" />
      <rect x="172" y="121" rx="6" ry="6" width="100" height="10" />
    </ContentLoader>
  </Box>
)

const mobile = (
  <Box bg={COLORS.LYNX_WHITE} mb="m">
    <ContentLoader
      speed={2}
      width="100%"
      height="auto"
      viewBox="0 0 280 293"
      preserveAspectRatio="xMidYMin meet"
      backgroundColor={COLORS.IRRADIANT_IRIS}
      foregroundColor={COLORS.SUPER_SILVER}
    >
      <rect x="13" y="141" rx="6" ry="6" width="144" height="13" />
      <rect x="0" y="0" rx="0" ry="0" width="280" height="126" />
      <rect x="13" y="169" rx="6" ry="6" width="134" height="10" />
      <rect x="13" y="187" rx="6" ry="6" width="122" height="10" />
      <rect x="13" y="219" rx="6" ry="6" width="142" height="10" />
      <rect x="206" y="265" rx="10" ry="10" width="61" height="18" />
      <rect x="13" y="237" rx="6" ry="6" width="100" height="10" />
      <rect x="13" y="265" rx="10" ry="10" width="31" height="18" />
    </ContentLoader>
  </Box>
)

const SkeletonLoader = () => (
  <Media>
    {(matches) => (
      <Box overflow="hidden">
        {matches.mobile ? (
          <>
            {mobile}
            {mobile}
          </>
        ) : (
          <>
            {desktop}
            {desktop}
            {desktop}
            {desktop}
          </>
        )}
      </Box>
    )}
  </Media>
)

export default SkeletonLoader
