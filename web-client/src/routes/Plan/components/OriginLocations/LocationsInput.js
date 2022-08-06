import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ellipsis, math, rem } from 'polished'
import Autosuggest from 'react-autosuggest'
import {
  fontSizes,
  fontWeights,
  radius,
  space,
  BOXSHADOWS,
  COLORS,
} from 'Theme'
import { Flex } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Input from 'components/Input'
import airplaneIcon from 'assets/images/svg/airplane-1.svg'
import strikedAirplaneIcon from 'assets/images/svg/airplane-striked.svg'

const SEARCH_RESULT_TYPES = {
  CITY: 'CITY',
  COUNTRY: 'COUNTRY',
  UNSUPPORTED_CITY: 'UNSUPPORTED_CITY',
  ALREADY_ADDED: 'ALREADY_ADDED',
}

const ICON_WIDTH = rem('45px')
const LINE_HEIGHT = rem('34px')

const SuggestionWrapper = styled('div')`
  display: flex;
  align-items: center;

  padding-right: ${space.m};

  line-height: ${LINE_HEIGHT};
  font-size: ${fontSizes.m};

  &:hover {
    cursor: ${({ type }) =>
      type === SEARCH_RESULT_TYPES.CITY ? 'text' : 'pointer'};
  }

  ${({ isOffset }) =>
    isOffset &&
    `
      margin-left: ${math(`${ICON_WIDTH} - ${space.m}`)};
    `}
`

const SectionTitle = styled('span')`
  display: block;

  margin-top: ${space.xs};
  padding: 0 ${space.m};

  font-size: ${fontSizes.s};
  font-weight: ${fontWeights.semi_bold};
  line-height: ${LINE_HEIGHT};
  text-transform: uppercase;

  color: ${COLORS.BLUEBERRY_SODA};
`

const Ellipsis = styled('span')`
  ${ellipsis()}
`

const theme = {
  container: {
    position: 'relative',
    width: '100%',
  },
  input: {
    textIndent: '0',
    textOverflow: 'ellipsis',
  },
  suggestionsContainer: {
    zIndex: '1',
    position: 'absolute',
    overflowY: 'auto',
    width: '100%',
    maxHeight: rem('420px'),
    padding: `${space.s} 0`,
    backgroundColor: COLORS.WHITE,
    boxShadow: BOXSHADOWS.CARD,
    borderRadius: `${radius.m}`,
  },
  suggestionsList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  suggestionHighlighted: {
    backgroundColor: COLORS.IRRADIANT_IRIS,
  },
}

const SuggestionsContainerComp = ({ containerProps, children }) =>
  children && <div {...containerProps}>{children}</div>

const SuggestionComp = ({ name, country, isOffset, type, title, suggestionType }) => {
  const getLabel = () => {
    switch (suggestionType || type) {
      default:
      case SEARCH_RESULT_TYPES.COUNTRY:
        return name
      case SEARCH_RESULT_TYPES.CITY:
        return `${name}, ${country}`
      case SEARCH_RESULT_TYPES.UNSUPPORTED_CITY:
        return (
          <Text color={COLORS.BLUEBERRY_SODA}>
            {title} <Text color={COLORS.BROTHER_BLUE}> • Nearby airports:</Text>
          </Text>
        )
        case SEARCH_RESULT_TYPES.ALREADY_ADDED:
        return (
          <Text color={COLORS.BLUEBERRY_SODA}>
            {name}{', '}{country} <Text color={COLORS.BROTHER_BLUE}> • Already added</Text>
          </Text>
        )
    }
  }

  return (
    <SuggestionWrapper isOffset={isOffset} type={type}>
      <Flex
        alignItems="center"
        justifyContent="center"
        flex="none"
        width={ICON_WIDTH}
      >
        <img
          src={
            type === SEARCH_RESULT_TYPES.UNSUPPORTED_CITY
              ? strikedAirplaneIcon
              : airplaneIcon
          }
          alt=""
        />
      </Flex>
      <Ellipsis>{getLabel()}</Ellipsis>
    </SuggestionWrapper>
  )
}

SuggestionComp.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string,
  title: PropTypes.string,
  isOffset: PropTypes.bool,
  country: PropTypes.string,
}

const SectionTitleComp = ({ title, type , suggestionType}) => {
  switch (type) {
    default:
    case SEARCH_RESULT_TYPES.COUNTRY:
      return <SectionTitle>{title}</SectionTitle>
    case SEARCH_RESULT_TYPES.UNSUPPORTED_CITY:
      return (
        <SuggestionComp
          title={title}
          type={SEARCH_RESULT_TYPES.UNSUPPORTED_CITY}
        />
      )
  }
}

SectionTitleComp.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string,
}

const LocationsInput = ({
  placeholder,
  isDisabled,
  onFocus,
  suggestions,
  onSuggestionsFetchRequested,
  onSuggestionSelected,
}) => {
  const [value, setValue] = React.useState('')
  const transformedSuggestions = suggestions.map((section) => ({
    ...section,
    suggestions: section.suggestions.map((suggestion) => {
      return {
      ...suggestion,
      isOffset: Boolean(section.title),
      suggestionType : suggestion.type,
      type:
        section.type === SEARCH_RESULT_TYPES.UNSUPPORTED_CITY
          ? SEARCH_RESULT_TYPES.CITY
          : section.type,
          
    }}),
  }))

  return (
    <Autosuggest
      multiSection
      theme={theme}
      suggestions={transformedSuggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionSelected={(_, { suggestion }) => {
        onSuggestionSelected(suggestion)
        setValue('')
      }}
      onSuggestionsClearRequested={() => {}}
      getSuggestionValue={({ name }) => name}
      getSectionSuggestions={(section) => section.suggestions}
      renderSuggestion={SuggestionComp}
      renderSectionTitle={SectionTitleComp}
      renderSuggestionsContainer={SuggestionsContainerComp}
      renderInputComponent={(inputProps) => <Input.Search {...inputProps} />}
      inputProps={{
        'data-hj-whitelist': true,
        placeholder,
        disabled: isDisabled,
        value,
        onChange: (_, { newValue }) => {
          setValue(newValue)
        },
        onFocus,
      }}
    />
  )
}

LocationsInput.propTypes = {
  placeholder: PropTypes.string,
  isDisabled: PropTypes.bool,
  onFocus: PropTypes.func.isRequired,
  suggestions: PropTypes.array.isRequired,
  onSuggestionsFetchRequested: PropTypes.func.isRequired,
  onSuggestionSelected: PropTypes.func.isRequired,
}

export default LocationsInput
