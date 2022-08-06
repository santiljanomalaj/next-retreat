import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from 'components/Checkbox'
import { Text } from 'components/atoms/Typography'
import styled from 'styled-components'
import { rem } from 'polished'
import { mq, fontStack, COLORS } from 'Theme'
import { Flex } from 'components/atoms/Layout'
import Media, { queries } from 'components/Media'
import { convertMinutesToHours } from 'utils/helpers'
import { ReactComponent as Airplane } from 'assets/images/svg/airplane-carousel.svg'

const VerticalFlex = styled(Flex)`
  flex-direction : column;
  margin-top: 8px;
`

const IconPlane = styled(Airplane)`
  width: ${rem(14)};
`

const SHeaderColumn = styled('th')`
  text-align: left
`

const TableBodyColumn = styled('td')`
`

const TableColumn = styled('tr')`
  ${mq.from.tablet`
    &:hover {
      background-color: white !important;
    }
  `}
`

const LinkButton = styled('button')`
  background: none!important;
  border: none;
  padding: 0!important;
  /*optional*/
  font-family: ${fontStack};
  /*input has OS specific font-family*/
  color: ${COLORS.CHUN_LI_BLUE};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const formatDate = (date) => {
  return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
}

const createKiwiLink = (from, to, startMonth, endMonth) => {
  let date = ''
  if (startMonth && endMonth) {
    date = `${startMonth}_${endMonth}`
  }
  else {
    const start = new Date()
    const end = new Date()
    end.setFullYear(start.getFullYear() + 1)
    date = `${formatDate(start)}_${formatDate(end)}`
  }
  return `https://www.kiwi.com/deep?affilid=nextretreatnrbooking&currency=EUR&departure=${date}&destination=${to}&lang=en&origin=${from}&return=${date}&stopNumber=1&transport=aircraft`
}

const Flights = ({ travelDurations, stepData, kiwiCityId }) => {
  const [showFlights, setShowFlights] = React.useState(false)
  const { destination } = stepData
  const {
    startMonth,
    endMonth,
  } = destination?.filters ?? {}

  return (
    <Media queries={queries}>
      {(matches) => (
        <VerticalFlex onClick={(e) => {
          e.preventDefault()
        }}>
          <div onClick={(e) => {
            setShowFlights(!showFlights)
          }}><Checkbox isChecked={showFlights}>
              <Text
                as="p"
                textAlign="left"
                fontSize="s"
                color={COLORS.DEEP_RESERVOIR}
                
              >
                Show flights information
              </Text>
            </Checkbox></div>
          {showFlights && (
            <table>
              {(!matches.mobile && !matches.tablet) && (<thead>
                <tr>
                  <SHeaderColumn>
                    <Text
                      as="p"
                      textAlign="left"
                      fontSize="s"
                      color={COLORS.DEEP_RESERVOIR}
                      
                    >
                      Connection
                    </Text>
                  </SHeaderColumn>
                  <SHeaderColumn>
                    <Text
                      as="p"
                      textAlign="left"
                      fontSize="s"
                      color={COLORS.DEEP_RESERVOIR}
                      
                    >
                      Type
                    </Text>
                  </SHeaderColumn>
                  <SHeaderColumn>
                    <Text
                      as="p"
                      textAlign="left"
                      fontSize="s"
                      color={COLORS.DEEP_RESERVOIR}
                      
                    >
                      Duration
                    </Text>
                  </SHeaderColumn>
                  <SHeaderColumn>
                    <Text
                      as="p"
                      textAlign="right"
                      fontSize="s"
                      color={COLORS.DEEP_RESERVOIR}
                      
                    >
                      ~ Price
                    </Text>
                  </SHeaderColumn>
                </tr>
              </thead>)}
              <tbody>
                {travelDurations.map((travelDuration) => {
                  return (
                    <>{travelDuration.price && (
                      <TableColumn key={travelDuration.originLocation}>
                        <TableBodyColumn>
                          <IconPlane />{' '}<LinkButton onClick={() => {
                            window.open(createKiwiLink(travelDuration.originLocation, (kiwiCityId || travelDuration.airportTo), startMonth, endMonth), '_blank').focus();
                          }
                          }><Text
                            as="p"
                            textAlign="left"
                            fontSize="s"
                            color={COLORS.CHUN_LI_BLUE}
                            
                          >
                              {travelDuration.originLocation + ' - ' + (kiwiCityId || travelDuration.airportTo)}
                            </Text>
                          </LinkButton>
                        </TableBodyColumn>
                        {(!matches.mobile && !matches.tablet) && (<><TableBodyColumn>
                          <Text
                            as="p"
                            textAlign="left"
                            fontSize="s"
                            color={COLORS.DEEP_RESERVOIR}
                            
                          >{travelDuration.stepovers > 0 ? 'max 1 stop' : 'Direct'}
                          </Text></TableBodyColumn>
                          <TableBodyColumn>
                            <Text
                              as="p"
                              textAlign="left"
                              fontSize="s"
                              color={COLORS.DEEP_RESERVOIR}
                              
                            >{convertMinutesToHours(travelDuration.duration || 0) + ' h'}</Text>
                          </TableBodyColumn></>
                        )}
                        {!(!matches.mobile && !matches.tablet) && (<TableBodyColumn>{travelDuration.stepovers > 0 ? '1 stop' : 'Direct'}{', '}{convertMinutesToHours(travelDuration.duration || 0) + ' h'}</TableBodyColumn>
                        )}
                        <TableBodyColumn><Text
                          as="p"
                          textAlign="right"
                          fontSize="s"
                          color={COLORS.DEEP_RESERVOIR}
                          
                        ><b>{'€ ' + travelDuration.price}</b></Text>
                        </TableBodyColumn>
                      </TableColumn>)}</>
                  )
                })}
              </tbody>
            </table>
          )}
        </VerticalFlex>
      )}
    </Media>
  )
}


Flights.propTypes = {
  travelDurations: PropTypes.array.isRequired,
  stepData: PropTypes.object.isRequired,
}

export default Flights