import React from 'react'
import SEO from 'components/SEO'
import GenericPage from 'components/GenericPage'
import RichText from 'components/RichText'
import { H1 } from 'components/Typography'
import Hero from 'routes/components/Hero'
import logo from 'images/european-operation-program/logo OPII a MDV_EFRR_EN.jpg'

const Terms = () => (
  <GenericPage>
    <SEO title="NextRetreat | EU legislative requirements" />
    <Hero>
      <H1 textAlign="center">EU legislative requirements</H1>
    </Hero>
    <RichText my={{ mobile: 'l', tablet: 'xl' }}>
      <img src={logo} alt="" style={{ padding: '0 40px' }} />
      <ul>
        <li>
          <b>Name of funding recipient:</b> NextRetreat s.r.o.
        </li>
        <li>
          <b>Name of the project:</b> NextRetreat online travel application
        </li>
        <li>
          <b>Place of project realisation:</b> Košice, Slovakia
        </li>
        <li>
          <b>Received EU funding:</b> 600.000 EUR
        </li>
        <li>
          <b>Project description:</b> NextRetreat is an online travel
          application focusing on group travel and providing an innovative
          solution for distributed teams to find the most accessible
          destinations and book most suitable accommodation for their group
          needs. Our company is based in Košice - Eastern Slovakia, which should
          support local entrepreneurial environment and create employment
          opportunities.
        </li>
        <li>
          <b>Note:</b> More information about OP Integrated Infrastructure 2014
          – 2020 can be found on{' '}
          <a
            href="https://www.opii.gov.sk"
            target="_blank"
            rel="noreferrer noopener"
          >
            www.opii.gov.sk
          </a>{' '}
          or{' '}
          <a
            href="https://www.vicepremier.gov.sk"
            target="_blank"
            rel="noreferrer noopener"
          >
            www.vicepremier.gov.sk
          </a>{' '}
          or{' '}
          <a
            href="https://www.opvai.sk"
            target="_blank"
            rel="noreferrer noopener"
          >
            www.opvai.sk
          </a>
        </li>
      </ul>
    </RichText>
  </GenericPage>
)

export default Terms
