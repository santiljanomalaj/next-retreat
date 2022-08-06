import React from 'react'
import PropTypes from 'prop-types'
import { COLORS } from 'Theme'
import { Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Input from 'components/Input'
import Filter from 'sharedComponents/Filter'

const CountFilter = ({ isDisabled, count, setCount, label, text }) => (
  <Filter isDisabled={isDisabled} label={label} hasFooter={false}>
    <Box>
      <Text display="block" mb="m" fontSize="s" color={COLORS.DEEP_RESERVOIR}>
        {text}
      </Text>
      <Input.Number
        value={count}
        onChange={(value) => setCount(value)}
        min={0}
        max={1000}
      />
    </Box>
  </Filter>
)

CountFilter.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  count: PropTypes.number.isRequired,
  setCount: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}

export default CountFilter
