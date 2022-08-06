import React from 'react'
import SEO from 'components/SEO'
import Form from '../../components/GetAccessModal/Form'
import App from '../../App'

const GetAccess = () => {
  return (
    <>
      <SEO
        title="NextRetreat | Get Access | Bring Your Team Together"
        description="Get access to the application"
      />
      <App>
        <Form />
      </App>
    </>
  )
}

export default GetAccess
