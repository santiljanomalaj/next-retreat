import React from 'react'
import Page from 'sharedComponents/Page'
import styled from 'styled-components'
import NotFoundImage from '../assets/images/svg/not_found.svg'
import { COLORS } from 'Theme'
import Media, { queries } from 'components/Media'

const MainDiv = styled('div')`
  display: flex;
`

const FirstLayer = styled('div')`
  width: 100%;
  text-align: center;
`

const SecondLayer = styled('div')`
  display: flex;
  flex-direction:column;
  width: 100%;
  margin-left: -100%;
  height:100;
  text-align: center;
  justify-content:space-around;
`
const Link = styled('a')`
  text-decoration: none;
  color: ${COLORS.CHUN_LI_BLUE};
  font-weight: 600;
  font-size: 18px;
`

const Title = styled('p')`
  font-weight: 700;
  font-size: 48px;
`

const Text = styled('p')`
  font-size: 18px;
  font-weight: 400;
`

const NotFound = () => {

  return (
    <Media queries={queries}>
      {(matches) => (
        <Page loginRequired={false}>
          {true && (
            <MainDiv>
              <FirstLayer>
                <img
                  src={NotFoundImage}
                  style={{ width: (matches.mobile ? 100 : 70) + '%' }}
                  alt="Not found"
                />
              </FirstLayer>
              <SecondLayer style={{
                  'padding-top': (matches.mobile ? 3 : 10) + '%',
                  'padding-left': (matches.mobile ? 2 : 30) + '%',
                  'padding-right': (matches.mobile ? 2 : 30) + '%',
              }}>
                <Title>404 - Page not found</Title>
                <Text>
                  Looks like you’re heading to the wrong destination! But don’t
                  worry, it’s just a 404 error. Here are some links to get you
                  back on track:
                </Text>
                <div>
                <p>
                  <Link href={`https://www.nextretreat.com/`}>Home</Link>
                </p>
                <p>
                  <Link href={`https://www.nextretreat.com/contact`}>
                    Contact us
                  </Link>
                </p>
                <p>
                  <Link href={`https://www.nextretreat.com/how-it-works/`}>
                    How it works
                  </Link>
                </p>
                <p>
                  <Link href={`${process.env.REACT_APP_WEBSITE_URL}/plan/`}>
                    Plan your trip
                  </Link>
                </p>
                <p>
                  <Link href={`https://www.nextretreat.com/faq/`}>
                    Frequently asked questions
                  </Link>
                </p>
                </div>
              </SecondLayer>
            </MainDiv>
          )}
        </Page>
      )}
    </Media>
  )
}

export default NotFound
