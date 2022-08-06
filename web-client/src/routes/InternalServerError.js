import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import Media, { queries } from '../components/Media'
import Page from 'sharedComponents/Page'
import { Text } from 'components/atoms/Typography'
import { Flex } from 'components/atoms/Layout'
import Button from 'components/atoms/Button'
import { COLORS } from 'Theme'

const FirstLayer = styled('div')`
  width: 100%;
  text-align: center;
`
const BackgroundText = styled(Text)`
  font-size: calc(45vw);
  color: ${COLORS.IRRADIANT_IRIS};
  font-weight: 700;
`

const SecondLayer = styled('div')`
  display: flex;
  flex-direction:column;
  width: 100%;
  margin-left: -100%;
  height:100;
  text-align: center;
  justify-content:center;
`

const InternalServerError = () => {
  const history = useHistory()

  return (
    <Media queries={queries}>
      {(matches) => (
        <Page loginRequired={false}>
          <Flex>
            <FirstLayer>
              <BackgroundText>500</BackgroundText>
            </FirstLayer>
            <SecondLayer>
              <Text as="p" fontSize="xxxxxxxl" fontWeight="bold" mb="l">Internal server error</Text>
              <Text as="p" fontSize="l" fontWeight="normal" mb="l">We're working on improving the experience. Won't be long...</Text>
              <Flex width="100%" justifyContent="center">
                <Button.Primary width="180px" onClick={() => { history.push('') }}>Return to home</Button.Primary>
              </Flex>
            </SecondLayer>
          </Flex>
        </Page>
      )}
    </Media>
  )
}

export default InternalServerError