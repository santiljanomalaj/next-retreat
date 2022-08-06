import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { format } from 'date-fns'
import { Text } from 'components/atoms/Typography'
import { COLORS, space } from 'Theme'
import Button from 'components/atoms/Button'
import { Flex } from 'components/atoms/Layout'
import Input from 'components/Input'
import Filter from 'sharedComponents/Filter'
import { useModal } from 'components/Modal'
import Checkbox from 'components/Checkbox'
import AvailabilityCalendarModal from '../../Plan/components/Venues/AvailabilityCalendarModal'
import trashIcon from 'assets/images/svg/trash.svg'

const PriceContainer = styled(Flex)`
    border-top: 1px solid ${COLORS.IRRADIANT_IRIS}
`

const TrashButon = styled(Button.Secondary)`
    margin-left: ${space.s};
    padding-left: ${space.m};
    padding-right: ${space.m};
    min-width:0;
`

const PriceInputContainer = styled('span')`
    position: relative;
    width: 100%;

    & input {
        padding-right:2rem;
        text-align: right;
    }
    &:after {
        position: absolute;
        top: 9px;
        content:"€";
        right: 13px;  
    }
`

const Variation = ({ variation = {}, index, variations, setVariations, venues, selectTab }) => {
    const areDatesSet = Boolean(variation.from) && Boolean(variation.to)
    const { isOpen, openModal, closeModal } = useModal()

    const getVenueTitle = (venueId) => {
        console.log("getVenueTitle", venueId, venues)
        return venues.find(venue => Number(venue.venue.id) === venueId)?.venue?.title
    }

    const setPrice = (price, priceIndex) => {
        setVariations(
            [...variations.slice(0, index), {
                ...variation,
                prices: [...variation.prices.slice(0, priceIndex), price, ...variation.prices.slice(priceIndex + 1, variation.prices.length)]
            }, ...variations.slice(index + 1, variations.length)]
        )
    }

    return (
        <>
            <Flex flexDirection="row" py="m">
                <Flex width="50%" justifyContent="flex-start">
                    <Button.Pill
                        isOutlined={areDatesSet}
                        onClick={openModal}
                    >
                        {areDatesSet
                            ? `${format((new Date((variation.from))), 'MMM d')} - ${format(
                                (new Date((variation.to))),
                                'MMM d yyyy'
                            )}`
                            : 'Select dates'}
                    </Button.Pill>
                    <Filter
                        label={variation.pax ? `${variation.pax} people` : 'Number of people'}
                        isChanged={true}>
                        <Input.Number value={variation.pax} onChange={(value) => {
                            setVariations(
                                [...variations.slice(0, index), {
                                    ...variation,
                                    pax: value,
                                }, ...variations.slice(index + 1, variations.length)]
                            )
                        }}></Input.Number>
                        <Text>A maximum number of people arriving to retreat from all team locations (min. 5)</Text>
                    </Filter>
                </Flex>
                <Flex width="50%" justifyContent="flex-end">
                    <Button.Primary onClick={() => {
                        if (variation.prices.length > 0) return

                        setVariations(
                            [...variations.slice(0, index), {
                                ...variation,
                                prices: venues.map(venue => ({
                                    venueId: Number(venue.venue.id),
                                    isAvailable: false,
                                    price: 0,
                                })),
                            }, ...variations.slice(index + 1, variations.length)]
                        )
                    }}>Fetch prices</Button.Primary>
                    <TrashButon onClick={() => {
                        if (variations.length === 1) {
                            setVariations([{ pax: 5, prices: [] }])
                        } else {
                            setVariations(
                                [...variations.slice(0, index), ...variations.slice(index + 1, variations.length)]
                            )
                            selectTab(0)
                        }
                    }}><img src={trashIcon} alt="trash" /></TrashButon>
                </Flex>
            </Flex>
            {variation.prices.map((price, priceIndex) => {
                return (
                    <Flex flexDirection="column" key={priceIndex}>
                        <PriceContainer flexDirection="row" pt="m" mb="xs">
                            <Flex width="50%" justifyContent="start">
                                <Text fontWeight="semi_bold" fontSize="m">{getVenueTitle(price.venueId)}</Text>
                            </Flex>
                            <Flex width="50%" justifyContent="space-between">
                                <Text as="p" fontWeight="semi_bold" fontSize="s">Total per trip</Text>
                                <Text as="p" fontWeight="normal" fontSize="xs" color={COLORS.DEEP_RESERVOIR}></Text>
                            </Flex>
                        </PriceContainer>
                        <Flex flexDirection="row" mb="m">
                            <Flex width="50%">
                                <Checkbox
                                    isChecked={!price.isAvailable}
                                    onChange={() => {
                                        setPrice({ ...price, isAvailable: !price.isAvailable }, priceIndex)
                                    }}
                                >
                                    <Text fontWeight="normal" fontSize="s">Not available</Text>

                                </Checkbox>
                            </Flex>
                            <Flex width="50%">
                                <PriceInputContainer>
                                    <Input 
                                    value={price.price} 
                                    type="number" 
                                    step=".01" 
                                    placeholder="0"
                                    onChange={({ target: { value } }) => {
                                    setPrice({ ...price, price: parseFloat(value) }, priceIndex)
                                }}></Input>
                                </PriceInputContainer>
                            </Flex>
                        </Flex>
                    </Flex>
                )
            })}
            <AvailabilityCalendarModal
                startDate={areDatesSet ? (new Date((variation.from))) : undefined}
                endDate={areDatesSet ? (new Date((variation.to))) : undefined}
                isOpen={isOpen}
                closeModal={closeModal}
                selectButtonText={'Apply'}
                onApply={({ startDate, endDate }) => {
                    setVariations(
                        [...variations.slice(0, index), {
                            ...variation,
                            from: startDate,
                            to: endDate,
                        }, ...variations.slice(index + 1, variations.length)]
                    )
                }
                }
            />
        </>
    )
}

Variation.propTypes = {
    variation: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    variations: PropTypes.array.isRequired,
    setVariations: PropTypes.func.isRequired,
    venues: PropTypes.array,
    selectTab: PropTypes.func.isRequired
}

export default Variation
