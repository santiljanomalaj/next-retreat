import React from 'react'
import styled from 'styled-components'
import { rem } from 'polished'
import { useTransition, animated } from 'react-spring'
import { Cookies } from 'react-cookie-consent'
import { mq, COLORS, space } from 'Theme'
import { EMAIL_VALIDATION_REGEX } from 'constants/constants'
import { Flex, Box } from 'components/Layout'
import { H2, Text } from 'components/Typography'
import Input from 'components/Input'
import Button from 'components/Button'
import RouterLink from 'components/RouterLink'
import Description from './Description'
import SuccessMessage from './SuccessMessage'

const NOT_ALLOWED_EMAIL_PROVIDERS = [
  'gmail',
  'yahoo',
  'yandex',
  'outlook',
  'hotmail',
  'zoho',
  'icloud'
]

const DURATION = 5000
const FORM_WIDTH = rem('277px')
const INPUT_HEIGHT = rem('40px')
const ANIMATED_DIV_STYLES = {
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  opacity: 0,
}
const { EMAIL, TEAM_SIZE, COMPANY_NAME, PHONE_NUMBER } = {
  EMAIL: 'email',
  TEAM_SIZE: 'teamSize',
  COMPANY_NAME: 'companyName',
  PHONE_NUMBER: 'phoneNumber',
}
const INITIAL_INPUTS_STATE = {
  [EMAIL]: '',
  [TEAM_SIZE]: '',
  [COMPANY_NAME]: '',
  [PHONE_NUMBER]: ''
}

const Link = styled(RouterLink)`
  width: fit-content;
  color: ${COLORS.CHUN_LI_BLUE};
  text-decoration: underline;
`

const StyledForm = styled('form')`
  width: ${FORM_WIDTH};
  ${mq.to.tablet`
    width: 100%;
  `}
  margin: 0 ${space.m};
`

const StyledInput = styled(Input)`
  height: ${INPUT_HEIGHT};
`

const Form = () => {
  // window.dataLayer.push({event : 'get_access'})
  const [inputValues, setInputValues] = React.useState(INITIAL_INPUTS_STATE)
  const [isCompanyNameRequired, setIsCompanyNameRequired] = React.useState(false)
  const [
    isSuccessMessageDisplayed,
    setIsSuccessMessageDisplayed,
  ] = React.useState(false)
  const postAccessData = async ({ email, teamSize, companyName, phoneNumber }) => {
    try {
      await fetch(process.env.GATSBY_API_URL, {
        method: 'POST',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation requestAccessForm ($input: RequestAccessFormInput!) {
              requestAccessForm (input: $input)
            }
           `,
          variables: {
            input: {
              email,
              teamSize,
              companyName,
              phoneNumber,
              trackingData: {
                utmSource : Cookies.get('utm_source'),
                utmMedium : Cookies.get('utm_medium'),
                utmCampaign : Cookies.get('utm_campaign'),
                gid : Cookies.get('_gid'),
                gclid : Cookies.get('gclid')
              }
            },
          },
        }),
      })

      setIsSuccessMessageDisplayed(true)
      setTimeout(() => setIsSuccessMessageDisplayed(false), DURATION)
    } catch {
      // do nothing
    }
  }
  const handleInputChange = ({ target: { name, value } }) => {
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }
  const validateInput = (value, name) => {
    if (name === EMAIL) {
      // check email provider
      // split na @ => split . => check provider, if not allowed, display company name input
      if(EMAIL_VALIDATION_REGEX.test(value)){
        const emailProvider = value.split('@')[1].split('.')[0].toLowerCase()
        const emailProviderAllowed = !NOT_ALLOWED_EMAIL_PROVIDERS.includes(emailProvider)
        if(emailProviderAllowed && isCompanyNameRequired === true){
          setIsCompanyNameRequired(false)
        }
        else if (!emailProviderAllowed && isCompanyNameRequired === false){
          setIsCompanyNameRequired(true)
        }
      }
      else if (isCompanyNameRequired === true){
        setIsCompanyNameRequired(false)
      }

      return value === INITIAL_INPUTS_STATE[EMAIL]
        ? true
        : EMAIL_VALIDATION_REGEX.test(value)
    }
    else if (name === COMPANY_NAME){
      if (value === INITIAL_INPUTS_STATE[COMPANY_NAME]) return true
      return value !== undefined && value !== ''
    }
    return value === INITIAL_INPUTS_STATE[TEAM_SIZE]
      ? true
      : value.length > 0 && value !== ''
  }
  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (
        !inputValues[TEAM_SIZE] ||
        !inputValues[EMAIL] ||
        !validateInput(inputValues[EMAIL], EMAIL)
      ) {
        return
      }
      const { email, teamSize, companyName, phoneNumber } = inputValues
      postAccessData({ email, teamSize: Number(teamSize), companyName, phoneNumber })
    } catch (error) {
      // do nothing
    }
  }
  const transitions = useTransition(isSuccessMessageDisplayed, null, {
    from: {
      ...ANIMATED_DIV_STYLES,
    },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })
  return (
    <Flex height="100vh">
      <Flex
        position="relative"
        alignItems="center"
        width={{ mobile: '100%', tablet: '50%', desktop: '57%' }}
      >
        {transitions.map(({ item, key, props }) =>
          item ? (
            <animated.div key={key} style={props}>
              <SuccessMessage />
            </animated.div>
          ) : (
            <animated.div key={key} style={props}>
              <StyledForm onSubmit={handleSubmit}>
                <H2 color={COLORS.SPACE_CADET} fontWeight="bold" mb="m">
                  Get access
                </H2>
                <Text as="p" fontSize="m" color={COLORS.SPACE_CADET} mb="l">
                  Please enter your email to request free access to NextRetreat
                  app.
                </Text>
                <StyledInput
                  type="email"
                  placeholder="Work email"
                  name={EMAIL}
                  onChange={handleInputChange}
                  value={inputValues[EMAIL]}
                  isInvalid={!validateInput(inputValues[EMAIL], EMAIL)}
                  required
                />
                <Box mt="m">
                <StyledInput
                  type="text"
                  placeholder="Company name"
                  name={COMPANY_NAME}
                  onChange={handleInputChange}
                  value={inputValues[COMPANY_NAME]}
                  isInvalid={!validateInput(inputValues[COMPANY_NAME], COMPANY_NAME)}
                  required={isCompanyNameRequired}
                  isHidden={!isCompanyNameRequired}
                />
                </Box>
                <Box mt="m">
                <StyledInput
                  type="text"
                  placeholder="Phone number"
                  name={PHONE_NUMBER}
                  onChange={handleInputChange}
                  value={inputValues[PHONE_NUMBER]}
                />
                </Box>
                <Box mt="m" mb="l">
                  <StyledInput
                    type="number"
                    placeholder="Team size"
                    name={TEAM_SIZE}
                    onChange={handleInputChange}
                    value={inputValues[TEAM_SIZE]}
                    isInvalid={
                      !validateInput(inputValues[TEAM_SIZE], TEAM_SIZE)
                    }
                    required
                  />
                </Box>
                <Text as="p" fontSize="xs" color={COLORS.SPACE_CADET_50} mb="s">
                  By requesting access, you agree to our{' '}
                  <Link to="/terms">Terms</Link>.
                </Text>
                <Button.Inline type="submit" isBlock>
                  Request access
                </Button.Inline>
              </StyledForm>
            </animated.div>
          )
        )}
      </Flex>
      <Flex
        overflow="scroll"
        display={{ mobile: 'none', tablet: 'flex' }}
        width={{ tablet: '50%', desktop: '43%' }}
        bg={COLORS.SOULSTONE_BLUE}
        p="xl"
      >
        <Description />
      </Flex>
    </Flex>
  )
}

export default Form
