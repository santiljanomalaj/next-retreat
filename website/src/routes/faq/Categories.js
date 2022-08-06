import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS, radius, mq, space } from 'Theme'
import { Flex, Box, Grid } from 'components/Layout'
import { Text } from 'components/Typography'
import bellIccon from 'images/svg/faq/bell-icon.svg'
import lockIcon from 'images/svg/faq/lock-icon.svg'
import notesIcon from 'images/svg/faq/notes-icon.svg'
import questionIcon from 'images/svg/faq/question-icon.svg'

const Icon = styled('img')`
  width: ${rem(26)};
  margin-bottom: ${space.m};
`

const ContainerBox = styled(Box)`
  min-height: ${rem(150)};
  border-radius: ${radius.m};
  background-color: ${COLORS.LYNX_WHITE};
  :not(:last-child) {
    margin-right: ${space.s};
  }
  ${mq.to.tablet`
    width: 100%;
    height: auto;
    min-height: auto;
  `}
`

const StyledBox = styled(Box)`
  > :not(:last-child) {
    margin-bottom: ${space.m};
  }
`

const QuestionBlock = ({ title, src, questions }) => (
  <ContainerBox>
    <Flex flexDirection="column" height="100%" py="l" px="m">
      <Icon src={src} />
      <Text
        fontSize="l"
        fontWeight="semi_bold"
        color={COLORS.SPACE_CADET}
        mb="m"
      >
        {title}
      </Text>
      <StyledBox>
        {questions.map((question) => (
          <Text key={question} as="p" fontSize="s" color={COLORS.CHUN_LI_BLUE}>
            {question}
          </Text>
        ))}
      </StyledBox>
    </Flex>
  </ContainerBox>
)

QuestionBlock.propTypes = {
  src: PropTypes.string.isRequired,
  questions: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
}

const Categories = () => (
  <Grid
    gridTemplateColumns={{
      mobile: `1fr`,
      tablet: `1fr 1fr`,
      desktop: `1fr 1fr 1fr 1fr`,
    }}
    gridGap="m"
  >
    <QuestionBlock
      src={notesIcon}
      title="Booking process"
      questions={[
        'How does the booking process work?',
        'What are your cancellation policies?',
        'How many people can you host?',
        'What are the workspaces like?',
      ]}
    />
    <QuestionBlock
      src={bellIccon}
      title="Additional services"
      questions={['What kind of services do you offer?']}
    />
    <QuestionBlock
      src={lockIcon}
      title="Policies & security"
      questions={['What are your cancellation policies?']}
    />
    <QuestionBlock
      src={questionIcon}
      title="Other"
      questions={['Who is the NR designed for?']}
    />
  </Grid>
)

export default Categories
