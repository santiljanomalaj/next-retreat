import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { mq, space, radius, COLORS, fontSizes, fontWeights } from 'Theme'
import { EMAIL_VALIDATION_REGEX } from 'constants/constants'
import { Flex, Box } from 'components/Layout'
import Input from 'components/Input'
import Button from 'components/Button'
import Select from 'components/Select'

const options = [
  { value: 'general', label: 'I have a general question' },
  { value: 'booking', label: 'I would like to make a booking' },
  { value: 'offering', label: 'I would like to ask about your offering' },
  { value: 'collaboration', label: 'I am a property owner (collaboration)' },
  { value: 'press', label: 'I am a journalist (press enquiry)' },
  { value: 'investor', label: 'I am an investor' },
]

const StyledForm = styled('form')`
  max-width: ${rem(548)};
  height: ${rem(390)};
  overflow: hidden;
  border-radius: ${radius.m};
  background-color: ${COLORS.LYNX_WHITE};
  ${mq.to.desktop`
    height: 100%;
    min-width: 100%;
  `}
`

const Textarea = styled(Input)`
  text-indent: unset;
  resize: none;
  height: ${rem(90)};
  padding: ${space.m};
`

const StyledButton = styled(Button.Inline)`
  width: 100%;
`

const StyledInput = styled(Input)`
  height: ${rem(40)};
`

const StyledLabel = styled('p')`
  font-size: ${fontSizes.s};
  font-weight: ${fontWeights.semi_bold};
  color: ${COLORS.SPACE_CADET};
  margin-bottom: ${space.s};
`

const { MESSAGE, FULL_NAME, EMAIL } = {
  MESSAGE: 'message',
  FULL_NAME: 'fullName',
  EMAIL: 'email',
}
const INITIAL_INPUTS_STATE = {
  [MESSAGE]: '',
  [FULL_NAME]: '',
  [EMAIL]: '',
}
const INITIAL_INPUTS_VALIDATION_STATE = {
  [MESSAGE]: false,
  [FULL_NAME]: false,
  [EMAIL]: false,
}

const ContactForm = ({ onSubmitForm }) => {
  const [questionType, setQuestionType] = React.useState(null)
  const [inputValues, setInputValues] = React.useState(INITIAL_INPUTS_STATE)
  const [areInputsInvalid, setAreInputsInvalid] = React.useState(
    INITIAL_INPUTS_VALIDATION_STATE
  )

  const postQuestion = async ({ fullName, email, message }) => {
    try {
      const response = await fetch(process.env.GATSBY_API_URL, {
        method: 'POST',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation SubmitContactForm($input: ContactFormInput!) {
              submitContactForm(input: $input)
            }
           `,
          variables: {
            input: {
              fullName,
              email,
              message,
            },
          },
        }),
      })

      const {
        data: { submitContactForm },
      } = await response.json()

      onSubmitForm(submitContactForm)
    } catch {
      // do nothing
    }
  }

  const validateInputs = (value, name) => {
    if (name === EMAIL) {
      setAreInputsInvalid((prev) => ({
        ...prev,
        [name]: !EMAIL_VALIDATION_REGEX.test(value),
      }))
    }
    if (name === FULL_NAME || name === MESSAGE) {
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

  const onSubmit = (e) => {
    e.preventDefault()
    if (areInputsInvalid[EMAIL]) {
      return
    }
    const { fullName, email, message } = inputValues
    postQuestion({ fullName, email, message })
  }

  return (
    <StyledForm onSubmit={onSubmit}>
      <Box p="m">
        <Box mb="m">
          <StyledLabel>How can we help you?</StyledLabel>
          <Select
            options={options}
            handleInputChange={setQuestionType}
            value={questionType}
          />
        </Box>
        <Flex flexDirection={{ mobile: 'column', tablet: 'row' }}>
          <Box flex="1">
            <StyledLabel>Full name</StyledLabel>
            <StyledInput
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
            <StyledLabel>Email</StyledLabel>
            <StyledInput
              type="email"
              placeholder="john@email.com"
              name={EMAIL}
              onChange={handleInputChange}
              value={inputValues[EMAIL]}
              onBlur={() => handleBlur(inputValues[EMAIL], EMAIL)}
              isInvalid={areInputsInvalid[EMAIL]}
              required
            />
          </Box>
        </Flex>
        <Box mb="l">
          <StyledLabel>Your message</StyledLabel>
          <Textarea
            as="textarea"
            name={MESSAGE}
            onChange={handleInputChange}
            value={inputValues[MESSAGE]}
            onBlur={() => handleBlur(inputValues[MESSAGE], MESSAGE)}
            isInvalid={areInputsInvalid[MESSAGE]}
            required
          />
        </Box>
        <StyledButton isBlock type="submit">
          Send
        </StyledButton>
      </Box>
    </StyledForm>
  )
}

ContactForm.propTypes = {
  onSubmitForm: PropTypes.func.isRequired,
}

export default ContactForm
