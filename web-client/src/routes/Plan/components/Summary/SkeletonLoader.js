import React from 'react'
import ContentLoader from 'react-content-loader'
import { COLORS } from 'Theme'
import { Box } from 'components/atoms/Layout'
import Media from 'components/Media'
import { TOPBAR_HEIGHT } from 'constants/style'

const desktop = (
  <>
    <ContentLoader
      speed={2}
      width="100%"
      height={327}
      viewBox="0 0 1440 327"
      preserveAspectRatio="xMidYMin slice"
      backgroundColor={COLORS.IRRADIANT_IRIS}
      foregroundColor={COLORS.SUPER_SILVER}
    >
      <rect x="160" y="95" rx="20" ry="20" width="415" height="40" />
      <rect x="160" y="160" rx="4" ry="4" width="167" height="54" />
      <rect x="172" y="252" rx="6" ry="6" width="96" height="10" />
      <rect x="172" y="232" rx="6" ry="6" width="144" height="10" />
      <rect x="351" y="160" rx="4" ry="4" width="167" height="54" />
      <rect x="363" y="252" rx="6" ry="6" width="96" height="10" />
      <rect x="363" y="232" rx="6" ry="6" width="144" height="10" />
      <rect x="541" y="160" rx="4" ry="4" width="167" height="54" />
      <rect x="553" y="252" rx="6" ry="6" width="96" height="10" />
      <rect x="553" y="232" rx="6" ry="6" width="144" height="10" />
      <rect x="732" y="160" rx="4" ry="4" width="167" height="54" />
      <rect x="922" y="160" rx="4" ry="4" width="167" height="54" />
      <rect x="1113" y="160" rx="4" ry="4" width="167" height="54" />
    </ContentLoader>
    <ContentLoader
      speed={2}
      width="100%"
      height={636}
      viewBox="0 0 1440 636"
      preserveAspectRatio="xMidYMin slice"
      backgroundColor={COLORS.IRRADIANT_IRIS}
      foregroundColor={COLORS.SUPER_SILVER}
    >
      <rect x="160" y="298" rx="15" ry="15" width="414" height="24" />
      <rect x="161" y="42" rx="2" ry="2" width="642" height="240" />
      <rect x="160" y="400" rx="6" ry="6" width="80" height="13" />
      <rect x="590" y="400" rx="6" ry="6" width="213" height="13" />
      <rect x="160" y="335" rx="6" ry="6" width="341" height="13" />
      <rect x="827" y="42" rx="4" ry="4" width="453" height="240" />
      <rect x="160" y="458" rx="6" ry="6" width="80" height="13" />
      <rect x="590" y="459" rx="6" ry="6" width="213" height="13" />
      <rect x="160" y="515" rx="6" ry="6" width="80" height="13" />
      <rect x="590" y="515" rx="6" ry="6" width="213" height="13" />
      <rect x="160" y="573" rx="6" ry="6" width="80" height="13" />
      <rect x="590" y="574" rx="6" ry="6" width="213" height="13" />
    </ContentLoader>
  </>
)

const tablet = (
  <ContentLoader
    speed={2}
    width="100%"
    height="100%"
    viewBox="0 0 768 902"
    backgroundColor={COLORS.IRRADIANT_IRIS}
    foregroundColor={COLORS.SUPER_SILVER}
  >
    <rect x="20" y="626" rx="15" ry="15" width="414" height="24" />
    <rect x="20" y="370" rx="2" ry="2" width="728" height="240" />
    <rect x="20" y="728" rx="6" ry="6" width="80" height="13" />
    <rect x="535" y="728" rx="6" ry="6" width="213" height="13" />
    <rect x="20" y="663" rx="6" ry="6" width="341" height="13" />
    <rect x="20" y="786" rx="6" ry="6" width="80" height="13" />
    <rect x="535" y="786" rx="6" ry="6" width="213" height="13" />
    <rect x="20" y="96" rx="20" ry="20" width="415" height="40" />
    <rect x="395" y="161" rx="4" ry="4" width="167" height="54" />
    <rect x="20" y="161" rx="4" ry="4" width="167" height="54" />
    <rect x="207" y="161" rx="4" ry="4" width="167" height="54" />
    <rect x="581" y="161" rx="4" ry="4" width="167" height="54" />
  </ContentLoader>
)

const mobile = (
  <ContentLoader
    speed={2}
    width="100%"
    height="100%"
    viewBox="0 0 320 568"
    backgroundColor={COLORS.IRRADIANT_IRIS}
    foregroundColor={COLORS.SUPER_SILVER}
  >
    <rect x="20" y="85" rx="15" ry="15" width="280" height="24" />
    <rect x="20" y="142" rx="4" ry="4" width="167" height="54" />
    <rect x="207" y="142" rx="4" ry="4" width="167" height="54" />
    <rect x="20" y="338" rx="4" ry="4" width="280" height="216" />
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
