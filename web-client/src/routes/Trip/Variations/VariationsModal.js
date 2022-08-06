import React from 'react'
import { gql, useMutation } from '@apollo/client'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { COLORS } from 'Theme'
import { format } from 'date-fns'
import { Text } from 'components/atoms/Typography'
import Button from 'components/atoms/Button'
import { Flex, Box } from 'components/atoms/Layout'
import Variation from './Variation'
import { toast } from 'react-toastify'
import personIcon from 'assets/images/svg/person-blue.svg'

const Tab = styled.button`
  font-size: 1rem;
  padding: 12px 12px;
  cursor: pointer;
  opacity: 0.6;
  background: white;
  border: 0;
  outline: 0;
  ${({ active }) =>
        active &&
        `
    color: ${COLORS.CHUN_LI_BLUE};
    border-bottom: 1px solid ${COLORS.CHUN_LI_BLUE};
    opacity: 1;
  `}
`;
const ButtonGroup = styled.div`
  display: flex;
`;

const StyledHeaderContainer = styled(Flex)`
  border-bottom: 1px solid ${COLORS.IRRADIANT_IRIS};
`

const SaveTripContainer = styled(Flex)`
    background-color: ${COLORS.LYNX_WHITE};
`

const SAVE_VARIATIONS = gql`
    mutation saveTripVariations($input: CreateTripVariationInput!) {
    saveTripVariations(input: $input)
    }
`

const PersonIcon = styled('img')`
    margin-left: 10px;
    height: 13.56ppx;
`

const VariationsModal = ({ tripVariations = [], setTripVariations, venues, tripId }) => {

    const abc = ['A', 'B', 'C', 'D', 'E']

    const [activeTab, setActiveTab] = React.useState(abc[0]);
    const [variations, setVariations] = React.useState(tripVariations)

    const [saveVariations, { loading: variationsSaving }] = useMutation(SAVE_VARIATIONS)

    return (
        <Flex
            height="100%"
            flexDirection="column"
            justifyContent="space-between"
        >
            <Flex
                height="100%"
                flexDirection="column"
                justifyContent="space-between"
                p="m"
            >
                <Box>
                    <Text as="p" fontSize="xl" >
                        Add dates and prices
                    </Text>
                </Box>
                <Box>
                    <StyledHeaderContainer
                        justifyContent="space-between"
                        alignItems="baseline"
                        ml={{ mobile: 'm', desktop: 's' }}
                        mr={{ mobile: 'm', desktop: 0 }}
                        mt="m"
                    >
                        <ButtonGroup>
                            {(variations).map((variation, index) => (
                                <Tab
                                    key={abc[index]}
                                    active={activeTab === abc[index]}
                                    onClick={() => setActiveTab(abc[index])}
                                >
                                    {(variation.from && variation.to && variation.pax) ? 
                                    <Text as="p" fontSize="m"><b>{abc[index]}</b>{' '}{format(new Date(variation.from), 'dd.M.')}{'-'}{format(new Date(variation.to), 'dd.M.yyyy')}{' '}<PersonIcon src={personIcon} alt="person"/>{variation.pax}</Text> 
                                    : `Variant ${abc[index]}`}
                                </Tab>
                            ))}
                            {variations.length < 5 && (<Tab onClick={() => {
                                setVariations([...variations, { pax: 5, prices: [] }])
                                setActiveTab(abc[variations.length])
                            }}>
                                + Add variant
                            </Tab>)}
                        </ButtonGroup>
                    </StyledHeaderContainer>
                    {(variations).map((variation, index) => (
                        <React.Fragment key={index}>
                            {activeTab === abc[index] && (
                                <Variation
                                    variation={variation}
                                    index={index}
                                    variations={variations}
                                    setVariations={setVariations}
                                    venues={venues}
                                    selectTab={(index) => {
                                        setActiveTab(abc[index])
                                    }}>
                                </Variation>
                            )}
                        </React.Fragment>
                    ))}
                </Box>

            </Flex>
            <SaveTripContainer width="100%" p="s">
                <Button.Primary isBlock onClick={async () => {
                    setTripVariations(variations)
                    await saveVariations({
                        variables: {
                            input: {
                                tripId,
                                variations: variations.map(variation => ({...variation, '__typename': undefined, prices : variation.prices.map(price => ({...price, '__typename': undefined}))}))
                            }
                        }
                    })
                    toast.success('Variations saved to trip')
                    //save mutate
                }}
                disabled={variationsSaving}>{variationsSaving ? 'Saving...' : 'Save to trip'}</Button.Primary>
            </SaveTripContainer>
        </Flex>
    )
}

VariationsModal.propTypes = {
    tripVariations: PropTypes.array,
    setTripVariations: PropTypes.func.isRequired,
    venues: PropTypes.array,
    tripId: PropTypes.number.isRequired
}

export default VariationsModal
