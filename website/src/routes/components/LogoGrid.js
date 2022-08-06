import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import ImageGrid from 'components/ImageGrid'
import logoConversio from 'images/logo-conversio.png'
import logoFresh8 from 'images/logo-fresh-8.png'
import logoSmartbnb from 'images/logo-smartbnb.png'
import logo3m$1k from 'images/logo-3m$1k.png'
import logoApiax from 'images/logo-apiax.png'
import logoBrainbotTechnologies from 'images/logo-brainbot-technologies.png'
import logoEradigmConsulting from 'images/logo-eradigm-consulting.png'
import logoFingo from 'images/logo-fingo.png'
import logoHotjar from 'images/logo-hotjar.png'
import logoSudolabs from 'images/logo-sudolabs.png'
import logoTeskalabs from 'images/logo-teskalabs.png'
import logoTheFuntasty from 'images/logo-the-funtasty.png'

const Image = styled('img')`
  ${({ height }) => height && `max-height: ${rem(height)};`}
  ${({ isTransparent }) => isTransparent && `opacity: 0.5;`}
`

const LogoGrid = ({ children }) => (
  <ImageGrid>
    <Image src={logoConversio} height="60px" alt="Conversio logo" />
    <Image src={logoHotjar} height="42px" isTransparent alt="Hotjar logo" />
    <Image src={logoSmartbnb} height="44px" isTransparent alt="Smartbnb logo" />
    <Image src={logoFresh8} height="67px" alt="Fresh8 logo" />
    <Image
      src={logoBrainbotTechnologies}
      height="54px"
      isTransparent
      alt="Brainbot technologies logo"
    />
    <Image
      src={logoTeskalabs}
      height="54px"
      isTransparent
      alt="Teskalabs logo"
    />
    <Image src={logoSudolabs} height="60px" alt="Sudolabs logo" />
    <Image src={logoApiax} height="42px" isTransparent alt="Apiax logo" />
    <Image
      src={logoTheFuntasty}
      height="52px"
      isTransparent
      alt="The funtasty logo"
    />
    <Image
      src={logoEradigmConsulting}
      height="76px"
      alt="Eradigm consulting logo"
    />
    <Image src={logo3m$1k} height="42px" isTransparent alt="3m$1k logo" />
    <Image src={logoFingo} height="42px" isTransparent alt="Fingo logo" />
    {children}
  </ImageGrid>
)

LogoGrid.Image = Image

LogoGrid.propTypes = {
  children: PropTypes.node,
}

export default LogoGrid
