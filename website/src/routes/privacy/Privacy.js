import React from 'react'
import SEO from 'components/SEO'
import GenericPage from 'components/GenericPage'
import RichText from 'components/RichText'
import { H1 } from 'components/Typography'
import Hero from 'routes/components/Hero'
import CookiesTable from './Cookies'

const Privacy = () => (
  <GenericPage>
    <SEO title="NextRetreat | Privacy policy" />
    <Hero>
      <H1 textAlign="center">Privacy Policy</H1>
    </Hero>
    <RichText my={{ mobile: 'l', tablet: 'xl' }}>
      <p>
        Your privacy is important to us. It is NextRetreat, s.r.o.’s (provider
        of NextRetreat.com) policy to respect your privacy regarding any
        information we may collect from you across our website,{' '}
        <a href="https://www.nextretreat.com">https://NextRetreat.com</a>, and
        other sites we own and operate. The identity and contact details of the NextRetreat.com is:
      </p>
      <ul>
        <li>Corporate Name: Next Retreat, s.r.o. (“NextRetreat”)</li>
        <li>Registered Office: Namestie osloboditelov 3/A, Kosice, 040 01, Slovakia, European Union.</li>
        <li>Slovak company identification number: 52 833 437</li>
        <li>Registry information: Commercial Registry of District Court Kosice I, section Sro, sheet 48002/V.</li>
        <li>E-mail: support@nextretreat.com</li>
      </ul>
      <p>
        We only ask for personal information when we truly need it to provide a
        service to you. We collect it by fair and lawful means, with your
        knowledge and consent. We also let you know why we’re collecting it and
        how it will be used.
      </p>
      <p>
        We only retain collected information for as long as necessary to provide
        you with your requested service. What data we store, we’ll protect
        within commercially acceptable means to prevent loss and theft, as well
        as unauthorised access, disclosure, copying, use or modification.
      </p>
      <p>
        We don’t share any personally identifying information publicly or with
        third-parties, except when required to by law.
      </p>
      <p>
        Our website may link to external sites that are not operated by us.
        Please be aware that we have no control over the content and practices
        of these sites, and cannot accept responsibility or liability for their
        respective privacy policies.
      </p>
      <p>
        You are free to refuse our request for your personal information, with
        the understanding that we may be unable to provide you with some of your
        desired services.
      </p>
      <p>
        Your continued use of our website will be regarded as acceptance of our
        practices around privacy and personal information. If you have any
        questions about how we handle user data and personal information, feel
        free to contact us.
      </p>
      <h3>Information we collect</h3>
      <p>
        The personal information that you are asked to provide, and the reasons
        why you are asked to provide it, will be made clear to you at the point
        we ask you to provide your personal information.
      </p>
      <p>
        If you contact us directly, we may receive additional information about
        you such as your name, email address, phone number, the contents of the
        message and/or attachments you may send us, and any other information
        you may choose to provide.
      </p>
      <p>
        When you register for an Account, we may ask for your contact
        information, including items such as name, company name, address, email
        address, and telephone number.
      </p>
      <h3>How we use your information</h3>
      <p>We use the information we collect in various ways, including to:</p>
      <ul>
        <li>Provide, operate, and maintain NextRetreat.com</li>
        <li>Improve, personalize, and expand NextRetreat.com</li>
        <li>Understand and analyze how you use NextRetreat.com</li>
        <li>Develop new products, services, features, and functionality</li>
        <li>
          Communicate with you, either directly or through one of our partners,
          including for customer service, to provide you with updates and other
          information relating to the website, and for marketing and promotional
          purposes
        </li>
        <li>Send you emails</li>
        <li>Find and prevent fraud</li>
      </ul>
      <CookiesTable/>
      <h3>GDPR Privacy Policy (Data Protection Rights)</h3>
      <p>
        We would like to make sure you are fully aware of all of your data
        protection rights. Every user is entitled to the following:
      </p>
      <p>
        The right to access – You have the right to request copies of your
        personal data. We may charge you a small fee for this service.
      </p>
      <p>
        The right to rectification – You have the right to request that we
        correct any information you believe is inaccurate. You also have the
        right to request that we complete the information you believe is
        incomplete.
      </p>
      <p>
        The right to erasure – You have the right to request that we erase your
        personal data, under certain conditions.
      </p>
      <p>
        The right to restrict processing – You have the right to request that we
        restrict the processing of your personal data, under certain conditions.
      </p>
      <p>
        The right to object to processing – You have the right to object to our
        processing of your personal data, under certain conditions.
      </p>
      <p>
        The right to data portability – You have the right to request that we
        transfer the data that we have collected to another organization, or
        directly to you, under certain conditions.
      </p>
      <p>The right to lodge a complaint with a supervisory authority - Without prejudice to any other administrative or judicial remedy, You have the right to lodge a complaint with a supervisory authority, which is the Office for Personal Data Protection of the Slovak Republic.</p>
      <p>
        If you make a request, we have one month to respond to you. If you would
        like to exercise any of these rights, please contact us privacy@nextretreat.com.
      </p>
      <p>This policy is effective as of 1 June 2020.</p>
    </RichText>
  </GenericPage>
)

export default Privacy
