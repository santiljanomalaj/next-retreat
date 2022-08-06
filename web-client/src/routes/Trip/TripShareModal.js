import React from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { COLORS, space } from 'Theme'
import { Text } from 'components/atoms/Typography'
import Button from 'components/atoms/Button'
import { Flex, Box } from 'components/atoms/Layout'
import CopyToClipboard from 'react-copy-to-clipboard'
import { toast } from 'react-toastify'
import Input from 'components/Input'
import * as Yup from 'yup'
import { Formik, Field } from 'formik'
import xMarkIcon from 'assets/images/svg/xmark.svg'

const WhiteBox = styled(Box)`
    background-color: ${COLORS.WHITE};
    border-radius:4px;
`

const TransparentBox = styled(Box)`
    border-bottom: 1px solid ${COLORS.IRRADIANT_IRIS};
    margin-left: ${space.m};
    margin-right: ${space.m};
`

const StyledForm = styled.form`
  width: 100%;
`

const GET_SHARED_USERS = gql`
 query tripSharedUsers($id: Int!) {
  tripSharedUsers(id: $id) {
    email
    accessToken
  }
}
`

const LinkButton = styled(Text)`
  background: none!important;
  border: none;
  padding: 0!important;
  color: ${COLORS.CHUN_LI_BLUE};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const SharedUserFlex = styled(Flex)`
padding-top: 10px;
padding-bottom: 10px;
      background-color: ${COLORS.LYNX_WHITE};
`

const RemoveUserWrapper = styled(Flex)`
    cursor: pointer
`

const SHARE_TRIP = gql`
    mutation shareTripWithUser($input: ShareTripInput!) {
    shareTripWithUser(input: $input) {
        email
        accessToken
    }
    }
`

const REMOVE_USER = gql`
  mutation deleteTripSharedUser($input: ShareTripInput!) {
  deleteTripSharedUser(input: $input) 
}

`

export const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email')
        .label('This field is required')
        .required(),
})

const TripShareModal = ({ tripName, tripId }) => {
    const { data} = useQuery(GET_SHARED_USERS, {
        variables: { id: tripId },
        onError: () => {
        },
        onCompleted: (resultData) => {
            setSharedUsers(resultData?.tripSharedUsers.slice(1, resultData?.tripSharedUsers?.length || 0))
        },
    })

    const creator = data?.tripSharedUsers[0]
    const [sharedUsers, setSharedUsers] = React.useState([])

    const [shareTrip] = useMutation(SHARE_TRIP)
    const [revokeAccess] = useMutation(REMOVE_USER)
    const [userAlreadyAdded, setUserAlreadyAdded] = React.useState(false)

    return (
        <Flex
            height="100%"
            flexDirection="column"
            justifyContent="space-between"
        >
            <WhiteBox p="m">
                <Flex
                    height="100%"
                    flexDirection="column"
                    justifyContent="space-between">
                    <Text as="p" fontSize="xl" fontWeight="semi_bold" mb="s" p="s">
                        Share "{tripName}" Trip with a user
                    </Text>
                    <Text as="p" fontSize="m" fontWeight="semi_bold" mb="s" p="s">
                        Users with access to this trip
                    </Text>
                    <Flex justifyContent="space-between" p="s">
                        <Text as="p">{creator?.email}</Text>
                        <Flex flexDirection="column" justifyContent="center">
                            <Text as="p" fontSize="xs" color={COLORS.BLUEBERRY_SODA}>CREATOR</Text>
                        </Flex>
                    </Flex>
                    {sharedUsers.map((sharedUser, index) => (
                        <SharedUserFlex key={index} mb="s" p="s" justifyContent="space-between">
                            <Flex>
                                <Text as="p">{sharedUser.email}</Text>
                            </Flex>
                            <Flex>
                                <Flex flexDirection="column" justifyContent="center">
                                    <CopyToClipboard
                                        text={`https://app.nextretreat.com/trip/${tripId}?token=${sharedUser.accessToken}`}
                                        onCopy={() => {
                                            toast.success('Copied to clipboard')
                                        }}
                                    >
                                        <LinkButton fontSize="s">Copy trip login link</LinkButton>
                                    </CopyToClipboard>
                                </Flex>
                                <RemoveUserWrapper flexDirection="column" justifyContent="center" mx="s" onClick={async () => {
                                    await revokeAccess({
                                        variables: {
                                            input: {
                                                id: tripId,
                                                email: sharedUser.email
                                            },
                                        },
                                    })

                                    setSharedUsers(sharedUsers.filter(su => su.email !== sharedUser.email))
                                }}>
                                    <img src={xMarkIcon} height="12px" alt="remove" />
                                </RemoveUserWrapper>
                            </Flex>
                        </SharedUserFlex>
                    ))}
                </Flex>
            </WhiteBox>
            <TransparentBox></TransparentBox>
            <WhiteBox p="m">
                <Flex
                    height="100%"
                    flexDirection="column"
                    justifyContent="space-between" >
                    <Text as="p" fontSize="m" fontWeight="semi_bold" mb="m">
                        Share with another user
                    </Text>
                    <Formik
                        initialValues={{
                            email: '',
                        }}
                        validationSchema={validationSchema}
                        validateOnMount
                        onSubmit={async (values) => {
                            try {
                                if (sharedUsers.some(sharedUser => sharedUser.email === values.email)) {
                                    setUserAlreadyAdded(true)
                                    return
                                }
                                setUserAlreadyAdded(false)
                                const response = await shareTrip({
                                    variables: {
                                        input: {
                                            id: tripId,
                                            email: values.email
                                        },
                                    },
                                })
                                setSharedUsers([...sharedUsers, response?.data?.shareTripWithUser])
                            } catch {
                                // do nothing
                            }
                        }}
                    >
                        {({ handleSubmit, isValid, isSubmitting }) => (
                            <StyledForm onSubmit={handleSubmit}>
                                <Text fontSize="s" fontWeight="semi_bold">Your email</Text>
                                <Field name="email">
                                    {({ field, meta }) => (
                                        <Input
                                            placeholder="Enter email address"
                                            isInvalid={meta.touched && (meta.error !== undefined || userAlreadyAdded)}
                                            required
                                            mt="s"
                                            {...field}
                                        />
                                    )}
                                </Field>
                                {userAlreadyAdded && (<Text fontSize="xs" color={COLORS.SPARKLING_RED}>This user is already added to the Trip</Text>)}
                                <Button.Primary
                                    disabled={!isValid || isSubmitting}
                                    isBlock
                                    type="submit"
                                    style={{ 'margin-top': space.m }}
                                >
                                    Add user
                                </Button.Primary>
                            </StyledForm>
                        )}
                    </Formik>
                </Flex>
            </WhiteBox>
        </Flex>
    )
}

TripShareModal.propTypes = {
    tripName: PropTypes.string.isRequired,
    tripId: PropTypes.number.isRequired
}

export default TripShareModal
