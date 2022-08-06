import 'sanitize.css'
import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import App from './App'
import * as serviceWorker from './serviceWorker'
import TagManager from 'react-gtm-module'
 
const tagManagerArgs = {
    gtmId: process.env.GTM_ID || 'GTM-WB7VMZQ'
}
 
TagManager.initialize(tagManagerArgs)

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
})

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
