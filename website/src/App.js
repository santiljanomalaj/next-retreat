import 'sanitize.css'
import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from 'styled-components'
import { useLocation } from '@reach/router'
import queryString from 'query-string';
import { Helmet } from 'react-helmet'
import { Cookies } from 'react-cookie-consent'
import { theme, GlobalStyles } from 'Theme'
import ConsentBar from 'components/ConsentBar'

const COOKIE_CONSENT_NAME = 'CookieConsent'

const setCookiesFromQuery = () => {

  //Here get the query params, save it to cookies and later these send to GTM
  const {utm_source, utm_medium, utm_campaign, gclid} = queryString.parse(useLocation().search);

  if(utm_source) Cookies.set('utm_source', utm_source)
  if(utm_medium) Cookies.set('utm_medium', utm_medium)
  if(utm_campaign) Cookies.set('utm_campaign', utm_campaign)
  if(gclid) Cookies.set('gclid', gclid)
}

const App = ({ children }) => {
  const [hasConsent, setHasConsent] = React.useState(
    Cookies.get(COOKIE_CONSENT_NAME)
  )

  setCookiesFromQuery();

  return (
    <ThemeProvider theme={theme}>
      <Helmet defer={false}>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-161115230-1"
        />
        <script>
          {`
            // Global site tag (gtag.js) - Google Analytics -->
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-161115230-1');
          `}
        </script>
        {process.env.GATSBY_HOTJAR_ID && hasConsent && (
          <script>
            {`
              // Hotjar Tracking Code for NR_STAGING
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:1734282,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `}
          </script>
        )}
      </Helmet>
      <GlobalStyles />
      <ConsentBar
        cookieName={COOKIE_CONSENT_NAME}
        onAccept={() => {
          setHasConsent(true)
        }}
      />
      {children}
    </ThemeProvider>
  )
}

App.propTypes = {
  children: PropTypes.node.isRequired,
}

export default App
