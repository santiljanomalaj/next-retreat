/* eslint-disable no-underscore-dangle */
import React from 'react'
import { Helmet } from 'react-helmet'
import { ThemeProvider } from 'styled-components'
import { configure, addDecorator } from '@storybook/react'
import 'sanitize.css'
import { theme, GlobalStyles } from 'Theme'

configure(require.context('../src', true, /\.stories\.js$/), module)

addDecorator((story) => (
  <ThemeProvider theme={theme}>
    <React.Fragment>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css?family=Titillium+Web:200,300,400,600,700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <GlobalStyles />
      {story()}
    </React.Fragment>
  </ThemeProvider>
))
