import React from 'react'
import { COLORS } from 'Theme'
import { Flex } from 'components/Layout'
import { Text } from 'components/Typography'
import bank from 'images/how-it-works/bank.svg'
import creditCards from 'images/how-it-works/credit-cards.svg'

export const paymentOptions = (
  <>
    <Text as="p" fontSize="m" fontWeight="semi_bold" mt="l" mb="s">
      All your favorite payment options
    </Text>
    <Flex alignItems="center" flexWrap="wrap">
      <Flex mr="s">
        <img src={creditCards} alt="Pay by Visa, Mastercard, Amex and PayPal" />
      </Flex>
      <Flex alignItems="center">
        <img src={bank} alt="" />
        <Text ml="s" fontSize="m" color={COLORS.DEEP_RESERVOIR}>
          Bank transfer
        </Text>
      </Flex>
    </Flex>
  </>
)
