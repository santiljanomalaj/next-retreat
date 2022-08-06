import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useMutation, gql } from '@apollo/client'
import { rem } from 'polished'
import {
  mq,
  space,
  radius,
  COLORS,
  fontSizes,
  BOXSHADOWS,
  fontWeights,
} from 'Theme'
import { Flex, Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Input from 'components/Input'
import Button from 'components/atoms/Button'
import { ReactComponent as CloseIcon } from 'assets/images/svg/close-modal.svg'

const REGEX = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/

const containerStyles = `
  max-width: ${rem(548)};
  overflow: hidden;
  border-radius: ${radius.m};
  box-shadow: ${BOXSHADOWS.CARD};
  background-color: ${COLORS.WHITE};
`

const StyledSuccessBox = styled('div')`
  position: relative;
  ${containerStyles};
  margin: 0 ${space.m} ${space.m};
`

const StyledForm = styled('form')`
  height: ${rem(334)};
  ${containerStyles};
  ${mq.to.tablet`
    min-width: 100vw;
    height: var(--nr-100vh, 100vh);
    box-shadow: unset;
    border-radius: 0;
  `}
`

const StyledLabel = styled('p')`
  font-size: ${fontSizes.s};
  font-weight: ${fontWeights.semi_bold};
  color: ${COLORS.SPACE_CADET};
  margin-bottom: ${space.s};
`

const CloseModalIcon = styled(CloseIcon)`
  height: ${rem(14)};
  margin-left: ${space.l};
`

const StyledBox = styled('div')`
  padding: ${space.m};
  box-shadow: ${BOXSHADOWS.LIGHT};
  background-color: ${COLORS.LYNX_WHITE};
  ${mq.from.tablet`
    padding: 0 ${space.m} ${space.m};
    box-shadow: unset;
    background-color: ${COLORS.WHITE};
  `}
`

const POST_DESTINATION_SUGGESTION = gql`
  mutation DestinationSuggestion($input: DestinationSuggestionInput!) {
    insertDestinationSuggestion(input: $input)
  }
`

const { DESTINATION_NAME, FULL_NAME, EMAIL } = {
  DESTINATION_NAME: 'destination',
  FULL_NAME: 'name',
  EMAIL: 'email',
}
const INITIAL_INPUTS_STATE = {
  [DESTINATION_NAME]: '',
  [FULL_NAME]: '',
  [EMAIL]: '',
}
const INITIAL_INPUTS_VALIDATION_STATE = {
  [DESTINATION_NAME]: false,
  [FULL_NAME]: false,
  [EMAIL]: false,
}

const SuggestionForm = ({ closeModal }) => {
  const [inputValues, setInputValues] = React.useState(INITIAL_INPUTS_STATE)
  const [areInputsInvalid, setAreInputsInvalid] = React.useState(
    INITIAL_INPUTS_VALIDATION_STATE
  )

  const validateInputs = (value, name) => {
    if (name === EMAIL) {
      setAreInputsInvalid((prev) => ({ ...prev, [name]: !REGEX.test(value) }))
    }
    if (name === DESTINATION_NAME || name === FULL_NAME) {
      setAreInputsInvalid((prev) => ({
        ...prev,
        [name]: !(value.length > 0 && value !== ''),
      }))
    }
  }

  const handleInputChange = ({ target: { name, value } }) => {
    setInputValues((prev) => ({ ...prev, [name]: value }))
    validateInputs(value, name)
  }

  const handleBlur = (value, name) => {
    validateInputs(value, name)
  }

  const [submitForm, { data }] = useMutation(POST_DESTINATION_SUGGESTION)

  const onSubmit = (e) => {
    e.preventDefault()
    if (areInputsInvalid[EMAIL]) {
      return
    }
    submitForm({
      variables: {
        input: {
          email: inputValues[EMAIL],
          name: inputValues[FULL_NAME],
          destination: inputValues[DESTINATION_NAME],
        },
      },
    })
  }

  if (data?.insertDestinationSuggestion) {
    return (
      <StyledSuccessBox>
        <Box my="m" mx={{ mobile: 'l', tablet: 'xl' }}>
          <Text
            as="p"
            textAlign={{ mobile: 'left', tablet: 'center' }}
            lineHeight="initial"
            fontSize="xxl"
            fontWeight="semi_bold"
            color={COLORS.SPACE_CADET}
            mb="s"
          >
            Thanks for your suggestion!
          </Text>
          <Text
            as="p"
            textAlign={{ mobile: 'left', tablet: 'center' }}
            fontSize="s"
            color={COLORS.DEEP_RESERVOIR}
          >
            We will contact you as soon as your destination is published on
            NextRetreat.com.
          </Text>
          <Box position="absolute" top="m" right="l">
            <button type="button" onClick={closeModal}>
              <CloseModalIcon />
            </button>
          </Box>
        </Box>
      </StyledSuccessBox>
    )
  }

  return (
    <StyledForm onSubmit={onSubmit}>
      <Flex flexDirection="column" justifyContent="space-between" height="100%">
        <Box height="100%" px="m" pt="m">
          <Flex
            justifyContent="space-between"
            alignItems="baseline"
            mt="xs"
            mb="m"
          >
            <div>
              <Text
                as="p"
                fontSize="xxl"
                fontWeight="semi_bold"
                color={COLORS.SPACE_CADET}
              >
                What destination should we add next?
              </Text>
              <Text as="p" fontSize="s" color={COLORS.DEEP_RESERVOIR}>
                Suggest which destination should we add to our inventory and we
                will inform you once it’s ready.
              </Text>
            </div>
            <button type="button" onClick={closeModal}>
              <CloseModalIcon />
            </button>
          </Flex>

          <Box mb="m">
            <StyledLabel>Destination name</StyledLabel>
            <Input
              placeholder="City, country, province"
              name={DESTINATION_NAME}
              onChange={handleInputChange}
              value={inputValues[DESTINATION_NAME]}
              onBlur={() =>
                handleBlur(inputValues[DESTINATION_NAME], DESTINATION_NAME)
              }
              isInvalid={areInputsInvalid[DESTINATION_NAME]}
              required
            />
          </Box>
          <Flex flexDirection={{ mobile: 'column', tablet: 'row' }}>
            <Box flex="1">
              <StyledLabel>Full name</StyledLabel>
              <Input
                placeholder="John Doe"
                name={FULL_NAME}
                value={inputValues[FULL_NAME]}
                onChange={handleInputChange}
                onBlur={() => handleBlur(inputValues[FULL_NAME], FULL_NAME)}
                isInvalid={areInputsInvalid[FULL_NAME]}
                required
              />
            </Box>
            <Box
              flex="1"
              ml={{ mobile: 0, tablet: 'm' }}
              mt={{ mobile: 'm', tablet: 0 }}
              mb="m"
            >
              <StyledLabel>Work email</StyledLabel>
              <Input
                type="email"
                placeholder="name@company.com"
                name={EMAIL}
                onChange={handleInputChange}
                value={inputValues[EMAIL]}
                onBlur={() => handleBlur(inputValues[EMAIL], EMAIL)}
                isInvalid={areInputsInvalid[EMAIL]}
                required
              />
            </Box>
          </Flex>
        </Box>
        <StyledBox>
          <Button.Primary isBlock type="submit">
            Notify me when it’s available
          </Button.Primary>
        </StyledBox>
      </Flex>
    </StyledForm>
  )
}

SuggestionForm.propTypes = {
  closeModal: PropTypes.func,
}

export default SuggestionForm
