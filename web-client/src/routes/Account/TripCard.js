import React from 'react'
import { Box, Flex } from 'components/atoms/Layout'
import { H6, Text } from 'components/atoms/Typography'
import styled from 'styled-components'
import { COLORS, fontSizes, fontWeights, space } from 'Theme'
import { rem } from 'polished'
import {useTripManagement, MODAL_TYPES} from "../../TripManagementProvider"
import MapNextretreat from 'assets/images/map-nextretreat.svg'
import RouterLink from 'sharedComponents/RouterLink'
import FlagImg from 'assets/images/flag.png'

const StyledImage = styled.img`
  width: 100%;
  height: 142px;
  border-top-left-radius: 0.5em;
  border-top-right-radius: 0.5em;
`
const LogoImage = styled.img`
  width: 55.12px;
  height: 26.91px;
`
const MapBox = styled(Box)`
  width: 100%;
  height: ${rem(142)};
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ pictureUrl }) =>
    `background: url("${pictureUrl}") center / cover no-repeat;`};
`
const TripDestVenueBox = styled(Box)`
  display: flex;
  align-items: center;
`
const DotSpan = styled('span')`
  font-size: ${fontSizes.xxs};
  font-weight: ${fontWeights.semi_bold};
  line-height: ${rem(12)};
  vertical-align: middle;
  text-align: center;
  letter-spacing: ${rem(-0.5)};
  color: ${COLORS.BROTHER_BLUE};
  margin: ${rem(0)} ${rem(5)};
`
const DestText = styled(Text)`
  font-size: ${fontSizes.s};
  line-height: ${rem(14)};
  letter-spacing: ${rem(-0.3)};
  color: ${COLORS.DEEP_BLUE};
  position: relative;
`
const Card = styled(Box)`
  height: 229px;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
  border-radius: 8px;
`
const LogoBox = styled(Box)`
  background: white;
  width: 71.53px;
  height: 42px;
  position: absolute;
  margin: 10px 0 0 7px;
  padding: 7.22px 0 0 8.53px;
  border-radius: 0.3em;
`
const EmptyTripImg = styled('img')`
  width: ${rem(20.14)};
  height: ${rem(23)};
`
const Hr = styled('hr')`
  width: 114%;
  margin-left: -7%;
`
const customButtonStyles = `
  cursor: pointer;
  text-decoration: none;
  border-style:none;
  width: 50px;
  height: 50px;
`
const Img = styled('img')`
  margin: 0 0% 1% 47%;
`

const TripName = styled(H6)`
  color: ${COLORS.DEEP_BLUE};
  font-size: ${fontSizes.l};
  font-weight: ${fontWeights.semi_bold};
  letter-spacing: ${rem(-0.9)};
  margin: ${rem(15)} ${rem(0)} ${space.s} ${space.m};
`
const StyledSecondaryButton = styled('button')`
  position: absolute;
  margin: 3rem -12rem;
  ${customButtonStyles}
`
const TripCard = ({ userTrip, flag }) => {
  const {openModal} = useTripManagement();
  const venuesNumber = userTrip.tripVenues.length
  console.log(userTrip);
  return (
    <Card>
      {flag === 1 && (
        <LogoBox>
          <LogoImage src={userTrip.logoUrl} />
        </LogoBox>
      )}
      {venuesNumber > 0 ? (
        <>
          <StyledImage src={userTrip.heroUrl} alt="" />
          <TripName>{userTrip.name}</TripName>
        </>
      ) : (
        <>
          <MapBox pictureUrl={MapNextretreat}>
            <StyledSecondaryButton
              onClick={() => {
                openModal({
                  type: MODAL_TYPES.EMPTY_MODAL
                })
              }}
            >
              <EmptyTripImg src={FlagImg} />
            </StyledSecondaryButton>
          </MapBox>
          <TripName>{userTrip.name}</TripName>
        </>
      )}
      <TripDestVenueBox>
        <DestText ml="1rem">
          {' '}
          {venuesNumber > 0
            ? venuesNumber > 1
              ? `${venuesNumber} destinations`
              : '1 destination'
            : '0 destination'}
        </DestText>
        <DotSpan>.</DotSpan>
        <DestText>
          {' '}
          {venuesNumber > 0
            ? venuesNumber > 1
              ? `${venuesNumber} venues`
              : '1 venue'
            : '0 venue'}
        </DestText>
      </TripDestVenueBox>

    </Card>
  )
}

export default TripCard
