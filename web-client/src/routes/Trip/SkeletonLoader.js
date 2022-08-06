import React from 'react'
import ContentLoader from 'react-content-loader'
import { COLORS } from 'Theme'
import { Box } from 'components/atoms/Layout'
import Media from 'components/Media'
import { TOPBAR_HEIGHT } from 'constants/style'

const desktop = (
  <ContentLoader
    speed={2}
    width="100%"
    height="100%"
    viewBox="0 0 1440 1024"
    preserveAspectRatio="xMidYMin slice"
    backgroundColor={COLORS.IRRADIANT_IRIS}
    foregroundColor={COLORS.SUPER_SILVER}
  >
    <rect x="160" y="464" rx="15" ry="15" width="451" height="24" />
    <rect x="942" y="464" rx="10" ry="10" width="205" height="24" />
    <rect x="942" y="516" rx="4" ry="4" width="319" height="40" />
    <rect x="0" y="0" rx="0" ry="0" width="1440" height="440" />
    <rect x="160" y="501" rx="6" ry="6" width="341" height="13" />
    <rect x="965" y="527" rx="6" ry="6" width="270" height="10" />
    <rect x="216" y="586" rx="6" ry="6" width="80" height="10" />
    <rect x="216" y="605" rx="6" ry="6" width="65" height="10" />
    <circle cx="183" cy="602" r="22" />
    <rect x="478" y="586" rx="6" ry="6" width="80" height="10" />
    <rect x="478" y="605" rx="6" ry="6" width="65" height="10" />
    <circle cx="445" cy="602" r="22" />
    <rect x="215" y="664" rx="6" ry="6" width="80" height="10" />
    <rect x="215" y="683" rx="6" ry="6" width="65" height="10" />
    <circle cx="182" cy="680" r="22" />
    <rect x="477" y="664" rx="6" ry="6" width="80" height="10" />
    <rect x="477" y="683" rx="6" ry="6" width="65" height="10" />
    <circle cx="444" cy="680" r="22" />
    <rect x="741" y="586" rx="6" ry="6" width="80" height="10" />
    <rect x="741" y="605" rx="6" ry="6" width="65" height="10" />
    <circle cx="708" cy="602" r="22" />
    <rect x="161" y="776" rx="6" ry="6" width="723" height="10" />
    <rect x="161" y="798" rx="6" ry="6" width="703" height="10" />
    <rect x="161" y="820" rx="6" ry="6" width="683" height="10" />
    <rect x="162" y="842" rx="6" ry="6" width="663" height="10" />
  </ContentLoader>
)

const tablet = (
  <ContentLoader
    speed={2}
    width="100%"
    height="100%"
    viewBox="0 0 768 902"
    preserveAspectRatio="xMidYMin slice"
    backgroundColor={COLORS.IRRADIANT_IRIS}
    foregroundColor={COLORS.SUPER_SILVER}
  >
    <rect x="83" y="262" rx="15" ry="15" width="451" height="24" />
    <rect x="82" y="732" rx="10" ry="10" width="289" height="24" />
    <rect x="82" y="818" rx="0" ry="0" width="604" height="327" />
    <rect x="0" y="0" rx="0" ry="0" width="768" height="235" />
    <rect x="83" y="329" rx="6" ry="6" width="536" height="13" />
    <rect x="83" y="779" rx="10" ry="10" width="205" height="20" />
    <rect x="137" y="404" rx="6" ry="6" width="80" height="10" />
    <rect x="137" y="423" rx="6" ry="6" width="65" height="10" />
    <circle cx="104" cy="420" r="22" />
    <rect x="355" y="404" rx="6" ry="6" width="80" height="10" />
    <rect x="355" y="423" rx="6" ry="6" width="65" height="10" />
    <circle cx="322" cy="420" r="22" />
    <rect x="137" y="482" rx="6" ry="6" width="80" height="10" />
    <rect x="137" y="501" rx="6" ry="6" width="65" height="10" />
    <circle cx="104" cy="500" r="22" />
    <rect x="355" y="482" rx="6" ry="6" width="80" height="10" />
    <rect x="355" y="501" rx="6" ry="6" width="65" height="10" />
    <circle cx="322" cy="500" r="22" />
    <rect x="563" y="404" rx="6" ry="6" width="80" height="10" />
    <rect x="563" y="423" rx="6" ry="6" width="65" height="10" />
    <circle cx="530" cy="420" r="22" />
    <rect x="82" y="576" rx="6" ry="6" width="603" height="10" />
    <rect x="82" y="597" rx="6" ry="6" width="586" height="10" />
    <rect x="82" y="620" rx="6" ry="6" width="570" height="10" />
    <rect x="82" y="642" rx="6" ry="6" width="553" height="10" />
  </ContentLoader>
)

const mobile = (
  <ContentLoader
    speed={2}
    width="100%"
    height="100%"
    viewBox="0 0 320 568"
    preserveAspectRatio="xMidYMin slice"
    backgroundColor={COLORS.IRRADIANT_IRIS}
    foregroundColor={COLORS.SUPER_SILVER}
  >
    <rect x="20" y="206" rx="10" ry="10" width="196" height="18" />
    <rect x="0" y="0" rx="0" ry="0" width="320" height="192" />
    <rect x="20" y="259" rx="6" ry="6" width="279" height="10" />
    <rect x="20" y="279" rx="6" ry="6" width="260" height="10" />
    <rect x="20" y="333" rx="6" ry="6" width="279" height="13" />
    <rect x="20" y="402" rx="6" ry="6" width="255" height="13" />
    <rect x="20" y="356" rx="6" ry="6" width="271" height="13" />
    <rect x="20" y="379" rx="6" ry="6" width="264" height="13" />
  </ContentLoader>
)

const SkeletonLoader = () => (
  <Media>
    {(matches) => (
      <Box
        overflow="hidden"
        height={`calc(100vh - ${TOPBAR_HEIGHT})`}
        bg={COLORS.LYNX_WHITE}
      >
        {/* eslint-disable no-nested-ternary */}
        {matches.mobile ? mobile : matches.tablet ? tablet : desktop}
      </Box>
    )}
  </Media>
)

export default SkeletonLoader
