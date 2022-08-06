import styled from 'styled-components'
import { rem } from 'polished'
import { space } from 'Theme'
import { Input } from './Input'

const Textarea = styled(Input).attrs({
  as: 'textarea',
})`
  padding: ${space.s};
  height: ${rem('90px')};
`

export default Textarea
