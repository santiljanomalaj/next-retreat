import React from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import { useAuth } from 'AuthProvider'
import { useQuery, useMutation, gql } from '@apollo/client'
import Media from 'react-media'
import { rem } from 'polished'
import {
  space,
  radius,
  COLORS,
  fontSizes,
  BOXSHADOWS,
  fontWeights,
  breakpoints,
} from 'Theme'
import { Flex, Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Tooltip from 'components/molecules/Tooltip'
import Input from 'components/Input'
import RadioGroup from 'components/RadioGroup'
import Checkbox from 'components/Checkbox'
import Button from 'components/atoms/Button'
import activitiesIcon from 'assets/images/activities-icon.png'
import foodIcon from 'assets/images/food-icon.png'
import insuranceIcon from 'assets/images/insurance-icon.png'
import requirementsIcon from 'assets/images/requirements-icon.png'
import transportationIcon from 'assets/images/transportation-icon.png'
import wifiIcon from 'assets/images/wifi-icon.png'
import loader from 'assets/images/svg/loader.svg'
import Select from 'components/Select'
import IconText from './IconText'

const LOADER_SIZE = rem('28px')
const REGEX = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/

const Form = styled('form')`
  width: 100%;
  background-color: ${COLORS.LYNX_WHITE};
`

const StyledLabel = styled('p')`
  font-size: ${fontSizes.s};
  font-weight: ${fontWeights.semi_bold};
  color: ${COLORS.SPACE_CADET};
  margin-bottom: ${space.s};
`

const borderOnHover = `0.5px solid ${COLORS.CHUN_LI_BLUE}`

const Textarea = styled('textarea')`
  display: block;
  height: ${rem(90)};
  width: 100%;
  font-size: ${fontSizes.m};
  padding: ${space.m};
  color: ${COLORS.SPACE_CADET};
  box-shadow: ${BOXSHADOWS.INNER};
  border: 0.5px solid ${COLORS.IRRADIANT_IRIS};
  border-radius: ${radius.m};
  @media (hover: hover) {
    &:hover {
      border: ${({ disabled }) => !disabled && borderOnHover};
    }
  }
  :focus {
    border: ${borderOnHover};
    background-color: ${COLORS.LYNX_WHITE};
  }
  ::placeholder {
    color: ${COLORS.SILK_SOX};
  }
`

const Warning = styled('p')`
  font-size: ${fontSizes.xs};
  color: ${COLORS.SPARKLING_RED};
  margin-top: ${space.xs};
`

const Link = styled('a')`
  color: ${COLORS.CHUN_LI_BLUE};
  text-decoration: underline;
`

Link.defaultProps = {
  as: 'a',
  target: '_blank',
  rel: 'noreferrer noopener',
}

const Loader = styled('img')`
  height: ${LOADER_SIZE};
  width: ${LOADER_SIZE};
`

const GET_COUNTRIES = gql`
  query CountrySelect {
    countries {
      code
      name
    }
  }
`

const SUBMIT_FORM = gql`
  mutation Booking($input: BookingInput!) {
    requestBooking(input: $input)
  }
`

const {
  NAME,
  EMAIL,
  TEL,
  COMPANY_NAME,
  VAT_NUMBER,
  COMPANY_ADDRESS,
  NOTES,
  COUNTRY,
} = {
  TEL: 'tel',
  NAME: 'name',
  EMAIL: 'email',
  NOTES: 'notes',
  VAT_NUMBER: 'vat',
  COMPANY_NAME: 'company',
  COMPANY_ADDRESS: 'address',
  COUNTRY: 'country',
}
const INITIAL_INPUTS_STATE = {
  [TEL]: '',
  [NAME]: '',
  [EMAIL]: '',
  [NOTES]: '',
  [VAT_NUMBER]: '',
  [COMPANY_NAME]: '',
  [COMPANY_ADDRESS]: '',
}
const INITIAL_INPUTS_VALIDATION_STATE = {
  [TEL]: false,
  [NAME]: false,
  [EMAIL]: false,
  [COUNTRY]: false,
}

const { WIFI, INSURANCE, ACTIVITIES, TRANSPORTATION, FOOD, OTHER } = {
  WIFI: 'WIFI',
  FOOD: 'FOOD',
  OTHER: 'OTHER',
  INSURANCE: 'INSURANCE',
  ACTIVITIES: 'ACTIVITIES',
  TRANSPORTATION: 'TRANSPORTATION',
}

const INITIAL_SERVICES_STATE = {
  [WIFI]: false,
  [FOOD]: false,
  [OTHER]: false,
  [INSURANCE]: false,
  [ACTIVITIES]: false,
  [TRANSPORTATION]: false,
}

const BookingForm = ({
  stepData,
  updateStepData,
  totalPrice,
  totalTaxesAndFees,
  totalResortFees,
  maxTeamSize,
  venue: { roomData, title, hotelidPpn },
}) => {
  const history = useHistory();
  const [isHelpNeeded, setIsHelpNeeded] = React.useState('')
  const [hasAgreedWithTerms, setHasAgreedWithTerms] = React.useState(false)
  const [formSubmissionsCount, setFormSubmissionsCount] = React.useState(0)
  const [inputValues, setInputValues] = React.useState(INITIAL_INPUTS_STATE)
  const [areInputsInvalid, setAreInputsInvalid] = React.useState(
    INITIAL_INPUTS_VALIDATION_STATE
  )
  const [servicesSelected, setServicesSelected] = React.useState(
    INITIAL_SERVICES_STATE
  )
  const [country, setCountry] = React.useState(null)
  const { pathname, search } = useLocation()

  const selectService = (id) => {
    setServicesSelected((prev) => ({ ...prev, [id]: !servicesSelected[id] }))
  }

  const validateInputs = (value, name) => {
    if (name === EMAIL) {
      setAreInputsInvalid((prev) => ({ ...prev, [name]: !REGEX.test(value) }))
    }
    if (name === NAME || name === TEL || name === COMPANY_NAME) {
      setAreInputsInvalid((prev) => ({
        ...prev,
        [name]: !(value.length > 0 && value !== ''),
      }))
    }
    if (name === COUNTRY) {
      setAreInputsInvalid((prev) => ({
        ...prev,
        [name]: !value,
      }))
    }
  }

  const handleInputChange = ({ target: { name, value } }) => {
    setInputValues((prev) => ({ ...prev, [name]: value }))
    validateInputs(value, name)
  }

  const handleSelectChange = (value, name) => {
    setCountry(value)
    validateInputs(value, name)
  }

  const handleBlur = (value, name) => {
    validateInputs(value, name)
  }

  const formattedOriginLocations =
    stepData.originLocations?.map(({ id, size }) => ({ city: id, size })) || []

  const servicesToSubmit = Object.entries(servicesSelected).reduce(
    (accumulator, current) => {
      if (current[1]) {
        return [...accumulator, current[0]]
      }
      return accumulator
    },
    []
  )

  const { currencyIsoCode } = roomData[0].pricePerNight

  const [submitForm, { loading: isSubmitFormLoading }] = useMutation(
    SUBMIT_FORM,
    {
      onCompleted: (data) => {
        updateStepData(({ summary: prevSummary }) => ({
          summary: {
            ...prevSummary,
            additionalServices: servicesToSubmit,
            userCommentary: inputValues[NOTES],
            bookingId: data.requestBooking,
          },
        }))
      },
    }
  )

  const { user } = useAuth()
  const onSubmit = (e) => {
    e.preventDefault()
    if (!country) {
      setAreInputsInvalid((prev) => ({ ...prev, [COUNTRY]: true }))
    }
    if (
      !hasAgreedWithTerms ||
      isHelpNeeded === '' ||
      areInputsInvalid[EMAIL] ||
      areInputsInvalid[COUNTRY]
    ) {
      setFormSubmissionsCount((prev) => prev + 1)
      return
    }
    submitForm({
      variables: {
        input: {
          userId: user.id,
          venueId: stepData.venue.id,
          originLocations: formattedOriginLocations,
          checkInDate: stepData.detail.checkInDate,
          checkOutDate: stepData.detail.checkOutDate,
          currencyIsoCode,
          hotelName: title,
          hotelidPpn,
          totalPrice,
          totalTaxesAndFees,
          totalResortFees,
          maxTeamSize,
          roomData: roomData.map(
            ({
              id,
              pricePerNight,
              resortFee,
              taxesAndFeesSum,
              subtotalSum,
              totalSum,
              occupancyLimit,
              cancelationPolicy,
              ...room
            }) => ({
              ...room,
              id,
              pricePerNight: pricePerNight.amount,
              resortFee: resortFee.amount,
              subtotal: subtotalSum.amount,
              taxesAndFees: taxesAndFeesSum.amount,
              total: totalSum.amount,
              occupancyLimit,
              cancelationPolicy: cancelationPolicy.description,
            })
          ),
          email: inputValues[EMAIL],
          phoneNumber: inputValues[TEL],
          name: inputValues[NAME],
          companyName: inputValues[COMPANY_NAME],
          // optional
          notes: inputValues[NOTES],
          country: country?.value,
          vatNumber: inputValues[VAT_NUMBER],
          companyAddress: inputValues[COMPANY_ADDRESS],
          additionalServices: servicesToSubmit,
          url: `${pathname}${search}`,
        },
      },
    })
  }

  const countriesQuery = useQuery(GET_COUNTRIES)

  if (countriesQuery.loading) {
    return <div>Loading...</div>
  }

  if (countriesQuery.error) {
    history.push('/internal-server-error')
  }

  const countriesSelectOptions = countriesQuery.data.countries.map(
    ({ name, code }) => ({
      label: name,
      value: { code, name },
    })
  )

  const radioHelpNeededSelectedEvent = (value) => {
    setServicesSelected(INITIAL_SERVICES_STATE);
    setIsHelpNeeded(value);
  }

  return (
    <Media
      queries={{
        mobile: `(min-width: ${breakpoints.tablet})`,
      }}
    >
      {(matches) => (
        <Form onSubmit={onSubmit}>
          <Box p="m">
            <Text
              as="p"
              fontSize="xxl"
              fontWeight="semi_bold"
              color={COLORS.SPACE_CADET}
              mt="xs"
              mb="m"
            >
              Finalize booking request
            </Text>
            <Flex flexDirection={{ mobile: 'column', tablet: 'row' }} mb="m">
              <Box flex="1">
                <StyledLabel>Company Email</StyledLabel>
                <Input
                  data-hj-whitelist
                  placeholder="john@doe.com"
                  type="email"
                  name={EMAIL}
                  onChange={handleInputChange}
                  value={inputValues[EMAIL]}
                  onBlur={() => handleBlur(inputValues[EMAIL], EMAIL)}
                  isInvalid={areInputsInvalid[EMAIL]}
                  required
                />
                {areInputsInvalid[EMAIL] && (
                  <Warning>Please fill in your email</Warning>
                )}
              </Box>
              <Box
                flex="1"
                ml={{ mobile: 0, tablet: 'm' }}
                mt={{ mobile: 'm', tablet: 0 }}
              >
                <StyledLabel>Phone Number</StyledLabel>
                <Input
                  data-hj-whitelist
                  placeholder="+1-541-754-3010"
                  type="tel"
                  name={TEL}
                  value={inputValues[TEL]}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur(inputValues[TEL], TEL)}
                  isInvalid={areInputsInvalid[TEL]}
                  required
                />
                {areInputsInvalid[TEL] && (
                  <Warning>Enter a valid phone number</Warning>
                )}
              </Box>
            </Flex>
            <Flex flexDirection={{ mobile: 'column', tablet: 'row' }} mb="s">
              <Box flex="1">
                <StyledLabel>Name</StyledLabel>
                <Input
                  data-hj-whitelist
                  placeholder="John Doe"
                  name={NAME}
                  value={inputValues[NAME]}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur(inputValues[NAME], NAME)}
                  isInvalid={areInputsInvalid[NAME]}
                  required
                />
              </Box>
              <Box
                flex="1"
                ml={{ mobile: 0, tablet: 'm' }}
                mt={{ mobile: 'm', tablet: 0 }}
              >
                <StyledLabel>Company Name</StyledLabel>
                <Input
                  data-hj-whitelist
                  placeholder="Doe Company"
                  name={COMPANY_NAME}
                  onChange={handleInputChange}
                  value={inputValues[COMPANY_NAME]}
                  onBlur={() =>
                    handleBlur(inputValues[COMPANY_NAME], COMPANY_NAME)
                  }
                  isInvalid={areInputsInvalid[COMPANY_NAME]}
                  required
                />
              </Box>
            </Flex>
            <Flex flexDirection={{ mobile: 'column', tablet: 'row' }} mb="m">
              <Box flex="1">
                <StyledLabel>Company Country</StyledLabel>
                <Select
                  options={countriesSelectOptions}
                  handleInputChange={(value) =>
                    handleSelectChange(value, COUNTRY)
                  }
                  value={country}
                  placeholder="Select"
                  isInvalid={areInputsInvalid[COUNTRY]}
                />
                {formSubmissionsCount > 0 && areInputsInvalid[COUNTRY] && (
                  <Warning>Please pick your country</Warning>
                )}
              </Box>
              <Box
                flex="1"
                ml={{ mobile: 0, tablet: 'm' }}
                mt={{ mobile: 'm', tablet: 0 }}
              >
                <StyledLabel>VAT Number / TAX ID</StyledLabel>
                <Input
                  data-hj-whitelist
                  name={VAT_NUMBER}
                  onChange={handleInputChange}
                  value={inputValues[VAT_NUMBER]}
                />
                <Text
                  as="p"
                  fontSize="xs"
                  color={COLORS.DEEP_RESERVOIR}
                  mt="xs"
                >
                  Failure to provide VAT number requires us to add 20% to your
                  total final price
                </Text>
              </Box>
            </Flex>
            <Flex flexDirection={{ mobile: 'column', tablet: 'row' }} mb="m">
              <Box flex="1">
                <StyledLabel>Company Address</StyledLabel>
                <Input
                  data-hj-whitelist
                  name={COMPANY_ADDRESS}
                  onChange={handleInputChange}
                  value={inputValues[COMPANY_ADDRESS]}
                />
              </Box>
            </Flex>
            <Box mb="m">
              <Flex>
                <StyledLabel>
                  Your special requests, notes & questions
                </StyledLabel>
                <Box ml="xs">
                  <Tooltip
                    maxWidth={rem(270)}
                    position="LEFT"
                    textAlign="left"
                    text="We are committed to make your team trip as pleasant and smooth as possible. Let us know how we can help!"
                  />
                </Box>
              </Flex>
              <Box mb="m">
                <Textarea
                  data-hj-whitelist
                  name={NOTES}
                  onChange={handleInputChange}
                  value={inputValues[NOTES]}
                />
              </Box>
              <Box mb="l">
                <StyledLabel>
                  Will you need our help with organizing any additional
                  services?
                </StyledLabel>
                <RadioGroup
                  selectedValue={isHelpNeeded}
                  onSelect={(value) => radioHelpNeededSelectedEvent(value)}
                >
                  <RadioGroup.Option
                    value
                    isInvalid={formSubmissionsCount > 0 && isHelpNeeded === ''}
                    label={
                      <Text>
                        <b>Yes</b>
                        {matches.mobile && `, I would love your help!*`}
                      </Text>
                    }
                  />
                  <RadioGroup.Option
                    value={false}
                    isInvalid={formSubmissionsCount > 0 && isHelpNeeded === ''}
                    label={
                      <Text>
                        <b>No</b>
                        {matches.mobile && `, I’m fine without your help!`}
                      </Text>
                    }
                  />
                </RadioGroup>
                <Text
                  as="p"
                  fontSize="xs"
                  color={COLORS.DEEP_RESERVOIR}
                  mt="xs"
                >
                  *This is just informational. We’ll cover all related details,
                  including available options, pricing and everything else once
                  your venue is successfully reserved (step 6: ‘design your
                  schedule’).
                </Text>
                {formSubmissionsCount > 0 && isHelpNeeded === '' && (
                  <Warning>Please choose your option</Warning>
                )}
              </Box>
              {isHelpNeeded && (
                <Box mb="l">
                  <Text
                    as="p"
                    fontSize="s"
                    fontWeight="semi_bold"
                    color={COLORS.DEEP_RESERVOIR}
                    mb="s"
                  >
                    NextRetreat services
                  </Text>
                  <Flex flexDirection={{ mobile: 'column', tablet: 'row' }}>
                    <Box flex="1">
                      <IconText
                        src={insuranceIcon}
                        title="Travel Insurance"
                        text="Travel Insurance for your team"
                        onClick={() => selectService(INSURANCE)}
                        isSelected={servicesSelected[INSURANCE]}
                      />
                    </Box>
                    <Box
                      flex="1"
                      ml={{
                        mobile: 0,
                        tablet: 'm',
                      }}
                      mt={{ mobile: 's', tablet: 0 }}
                    >
                      <IconText
                        src={wifiIcon}
                        title="WiFi dongles"
                        text="Pocket WiFi boxes & other internet solutions"
                        onClick={() => selectService(WIFI)}
                        isSelected={servicesSelected[WIFI]}
                      />
                    </Box>
                  </Flex>
                  <Box mt="m">
                    <Text
                      as="p"
                      fontSize="s"
                      fontWeight="semi_bold"
                      color={COLORS.DEEP_RESERVOIR}
                      mb="s"
                    >
                      We can help you organize the following
                    </Text>
                    <Flex flexDirection={{ mobile: 'column', tablet: 'row' }}>
                      <Box flex="1">
                        <IconText
                          src={transportationIcon}
                          title="Transportation"
                          text="Airport transfers, minibus, car rentals.."
                          onClick={() => selectService(TRANSPORTATION)}
                          isSelected={servicesSelected[TRANSPORTATION]}
                        />
                      </Box>
                      <Box
                        flex="1"
                        ml={{
                          mobile: 0,
                          tablet: 'm',
                        }}
                        mt={{ mobile: 's', tablet: 0 }}
                      >
                        <IconText
                          src={requirementsIcon}
                          title="Other requirements"
                          text="Workspace equipment, beamer, flipchart, markers.."
                          onClick={() => selectService(OTHER)}
                          isSelected={servicesSelected[OTHER]}
                        />
                      </Box>
                    </Flex>
                    <Flex
                      flexDirection={{ mobile: 'column', tablet: 'row' }}
                      mt="s"
                    >
                      <Box flex="1">
                        <IconText
                          src={foodIcon}
                          title="Food"
                          text="Personal chef, catering options, supermarkets information.."
                          onClick={() => selectService(FOOD)}
                          isSelected={servicesSelected[FOOD]}
                        />
                      </Box>
                      <Box
                        flex="1"
                        ml={{
                          mobile: 0,
                          tablet: 'm',
                        }}
                        mt={{ mobile: 's', tablet: 0 }}
                      >
                        <IconText
                          src={activitiesIcon}
                          title="Activities"
                          text="Local activities for team building, bonding & having fun"
                          onClick={() => selectService(ACTIVITIES)}
                          isSelected={servicesSelected[ACTIVITIES]}
                        />
                      </Box>
                    </Flex>
                  </Box>
                </Box>
              )}
              <Box mb="l">
                <Checkbox
                  isInvalid={formSubmissionsCount > 0 && !hasAgreedWithTerms}
                  isChecked={hasAgreedWithTerms}
                  onChange={() => {
                    setHasAgreedWithTerms((prevChecked) => !prevChecked)
                  }}
                >
                  <Text fontSize="m">
                    I agree with{' '}
                    <Link href={`https://www.nextretreat.com/terms`}>
                      Terms of Use
                    </Link>{' '}
                    and{' '}
                    <Link href={`https://www.nextretreat.com/privacy`}>
                      Privacy Policy
                    </Link>
                  </Text>
                </Checkbox>
                {formSubmissionsCount > 0 && !hasAgreedWithTerms && (
                  <Warning>
                    Please indicate that you accept the Terms of Use and Privacy
                    Policy
                  </Warning>
                )}
              </Box>
              <Button.Primary
                isBlock
                type="submit"
                disabled={isSubmitFormLoading}
              >
                {isSubmitFormLoading ? (
                  <>
                    <Loader src={loader} alt="" />
                    Processing...
                  </>
                ) : (
                  'Request to book'
                )}
              </Button.Primary>
            </Box>
          </Box>
        </Form>
      )}
    </Media>
  )
}

BookingForm.propTypes = {
  stepData: PropTypes.shape({
    detail: PropTypes.shape({
      checkInDate: PropTypes.string.isRequired,
      checkOutDate: PropTypes.string.isRequired,
    }).isRequired,
    venue: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    originLocations: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
      }).isRequired
    ).isRequired,
  }).isRequired,
  updateStepData: PropTypes.func.isRequired,
  totalPrice: PropTypes.number.isRequired,
  totalTaxesAndFees: PropTypes.number.isRequired,
  totalResortFees: PropTypes.number.isRequired,
  maxTeamSize: PropTypes.number.isRequired,
  venue: PropTypes.shape({
    roomData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        pricePerNight: PropTypes.shape({
          amount: PropTypes.number.isRequired,
          currencyIsoCode: PropTypes.string.isRequired,
        }).isRequired,
        resortFee: PropTypes.shape({
          amount: PropTypes.number.isRequired,
          currencyIsoCode: PropTypes.string.isRequired,
        }).isRequired,
        subtotal: PropTypes.shape({
          amount: PropTypes.number.isRequired,
          currencyIsoCode: PropTypes.string.isRequired,
        }).isRequired,
        taxesAndFees: PropTypes.shape({
          amount: PropTypes.number.isRequired,
          currencyIsoCode: PropTypes.string.isRequired,
        }).isRequired,
        total: PropTypes.shape({
          amount: PropTypes.number.isRequired,
          currencyIsoCode: PropTypes.string.isRequired,
        }).isRequired,
      })
    ),
    title: PropTypes.string.isRequired,
    hotelidPpn: PropTypes.number.isRequired,
  }),
}

export default BookingForm
