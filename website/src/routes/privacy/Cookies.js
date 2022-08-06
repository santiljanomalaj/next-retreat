import React from 'react'
import styled from 'styled-components'
import { Cookies } from 'react-cookie-consent'

const COOKIE_CONSENT_NAME = 'CookieConsent'

const TableContainer = styled('div')`
padding: 4px;
border: 1px solid #e8e8e8
`

const Table = styled('table')`
    table-layout: fixed; 
    width: 100%;
`
const Th = styled('th')`
border-bottom: 2px solid #175EDC;
`

const Td = styled('td')`
border-bottom: 1px solid #e8e8e8;
`

const LinkButton = styled('button')`
background: none!important;
  border: none;
  padding: 0!important;
  /*optional*/
  font-family: arial, sans-serif;
  /*input has OS specific font-family*/
  color: #069;
  text-decoration: underline;
  cursor: pointer;
  `

const CookiesTable = () => {
    return (
        <>
            <h2>Cookies</h2>
            To revoke your consent <LinkButton onClick={() => {
                Cookies.remove(COOKIE_CONSENT_NAME)
            }
            }>click here</LinkButton>.
            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            <Th class="tg-j6zm"><span >Cookie</span></Th>
                            <Th class="tg-j6zm"><span >Provider</span></Th>
                            <Th class="tg-j6zm"><span >Domain</span></Th>
                            <Th class="tg-j6zm"><span >Type</span></Th>
                            <Th class="tg-j6zm"><span >Description</span></Th>
                            <Th class="tg-j6zm"><span >Duration</span></Th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <Td class="tg-7zrl">_ga_6KWZCKDCC1</Td>
                            <Td class="tg-7zrl">Google</Td>
                            <Td class="tg-7zrl">.nextretreat.com</Td>
                            <Td class="tg-7zrl">Analytics</Td>
                            <Td class="tg-7zrl">This cookie is installed by Google Analytics.</Td>
                            <Td class="tg-7zrl">2 years</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">_ga</Td>
                            <Td class="tg-7zrl">Google</Td>
                            <Td class="tg-7zrl">.nextretreat.com</Td>
                            <Td class="tg-7zrl">Analytics</Td>
                            <Td class="tg-7zrl">This cookie is installed by Google Analytics. The cookie is used to calculate visitor, session, campaign data and keep track of site usage for the site's analytics report. The cookies store information anonymously and assign a randomly generated number to identify unique visitors.</Td>
                            <Td class="tg-7zrl">2 years</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">_gid</Td>
                            <Td class="tg-7zrl">Google</Td>
                            <Td class="tg-7zrl">.nextretreat.com</Td>
                            <Td class="tg-7zrl">Analytics</Td>
                            <Td class="tg-7zrl">This cookie is installed by Google Analytics. The cookie is used to store information of how visitors use a website and helps in creating an analytics report of how the website is doing. The data collected including the number visitors, the source where they have come from, and the pages visted in an anonymous form.</Td>
                            <Td class="tg-7zrl">1 day</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">_gat_gtag_UA_161115230_1</Td>
                            <Td class="tg-7zrl">Google</Td>
                            <Td class="tg-7zrl">.nextretreat.com</Td>
                            <Td class="tg-7zrl">Analytics</Td>
                            <Td class="tg-7zrl">This cookie is set by Google and is used to distinguish users.</Td>
                            <Td class="tg-7zrl">1 minute</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">PHPSESSID</Td>
                            <Td class="tg-7zrl"></Td>
                            <Td class="tg-7h26"><a href="http://blog.nextretreat.com/">blog.nextretreat.com</a></Td>
                            <Td class="tg-7zrl">Necessary</Td>
                            <Td class="tg-7zrl">This cookie is native to PHP applications. The cookie is used to store and identify a users' unique session ID for the purpose of managing user session on the website. The cookie is a session cookies and is deleted when all the browser windows are closed.</Td>
                            <Td class="tg-7zrl">session</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">drift_campaign_refresh</Td>
                            <Td class="tg-7zrl"></Td>
                            <Td class="tg-7h26"><a href="http://app.nextretreat.com/">app.nextretreat.com</a></Td>
                            <Td class="tg-7zrl">Other</Td>
                            <Td class="tg-7zrl">No description available.</Td>
                            <Td class="tg-7zrl">30 minutes</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">_hjAbsoluteSessionInProgress</Td>
                            <Td class="tg-7zrl">Hotjar</Td>
                            <Td class="tg-7zrl">.nextretreat.com</Td>
                            <Td class="tg-7zrl">Statistics</Td>
                            <Td class="tg-7zrl">This cookie is installed by HotJar. The cookie is used to store unique visits.</Td>
                            <Td class="tg-7zrl">session</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">__gtm_referrer</Td>
                            <Td class="tg-7zrl">Google</Td>
                            <Td class="tg-7zrl">.nextretreat.com</Td>
                            <Td class="tg-7zrl">Analytics</Td>
                            <Td class="tg-7zrl">This cookie is installed by Google Tag Manager.</Td>
                            <Td class="tg-7zrl">session</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">utm_medium</Td>
                            <Td class="tg-7zrl">Google</Td>
                            <Td class="tg-7zrl">.nextretreat.com</Td>
                            <Td class="tg-7zrl">Analytics</Td>
                            <Td class="tg-7zrl">This cookie is installed by Google Tag Manager.</Td>
                            <Td class="tg-7zrl">session</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">clid</Td>
                            <Td class="tg-7zrl">Google</Td>
                            <Td class="tg-7zrl">.nextretreat.com</Td>
                            <Td class="tg-7zrl">Analytics</Td>
                            <Td class="tg-7zrl">This cookie is installed by Google Tag Manager.</Td>
                            <Td class="tg-7zrl">session</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">utm_source</Td>
                            <Td class="tg-7zrl">Google</Td>
                            <Td class="tg-7zrl">.nextretreat.com</Td>
                            <Td class="tg-7zrl">Analytics</Td>
                            <Td class="tg-7zrl">This cookie is installed by Google Tag Manager.</Td>
                            <Td class="tg-7zrl">session</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">__gtm_campaign_url</Td>
                            <Td class="tg-7zrl">Google</Td>
                            <Td class="tg-7zrl">.nextretreat.com</Td>
                            <Td class="tg-7zrl">Analytics</Td>
                            <Td class="tg-7zrl">This cookie is installed by Google Tag Manager.</Td>
                            <Td class="tg-7zrl">session</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">intercom-session-[app_id]</Td>
                            <Td class="tg-7zrl">Intercom</Td>
                            <Td class="tg-7zrl">.nextretreat.com</Td>
                            <Td class="tg-7zrl">Necessary</Td>
                            <Td class="tg-7zrl"></Td>
                            <Td class="tg-7zrl">1 week</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">_hjid</Td>
                            <Td class="tg-7zrl">Hotjar</Td>
                            <Td class="tg-7zrl">.nextretreat.com</Td>
                            <Td class="tg-7zrl">Statistics</Td>
                            <Td class="tg-7zrl">This cookie is installed by HotJar. The cookie is used to store unique visits.</Td>
                            <Td class="tg-7zrl">1 year</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">_hjIncludedInPageviewSample</Td>
                            <Td class="tg-7zrl">Hotjar</Td>
                            <Td class="tg-7zrl">.nextretreat.com</Td>
                            <Td class="tg-7zrl">Statistics</Td>
                            <Td class="tg-7zrl">This cookie is set to let Hotjar know whether that user is included in the data sampling defined by your site's pageview limit.</Td>
                            <Td class="tg-7zrl">30 minutes</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">_fbp</Td>
                            <Td class="tg-7zrl">Facebook</Td>
                            <Td class="tg-7zrl">.nextretreat.com</Td>
                            <Td class="tg-7zrl">Marketing</Td>
                            <Td class="tg-7zrl">Used by Facebook to deliver a series of advertisement products such as real-time bidding from third-party advertisers.</Td>
                            <Td class="tg-7zrl">3 months</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">MUID (Microsoft User ID)</Td>
                            <Td class="tg-7zrl">Microsoft</Td>
                            <Td class="tg-7zrl">.nextretreat.com</Td>
                            <Td class="tg-7zrl">Marketing</Td>
                            <Td class="tg-7zrl">This cookie is set by Microsoft as a unique user ID. The cookie enables user tracking by synchronising the ID across many Microsoft domains.</Td>
                            <Td class="tg-7zrl">1 year</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">UserMatchHistory</Td>
                            <Td class="tg-7zrl">Linkedin</Td>
                            <Td class="tg-7zrl">.nextretreat.com</Td>
                            <Td class="tg-7zrl">Marketing</Td>
                            <Td class="tg-7zrl">This cookie is set by LinkedIn Ads for ID syncing.</Td>
                            <Td class="tg-7zrl">30 days</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">driftt_aid</Td>
                            <Td class="tg-7zrl"></Td>
                            <Td class="tg-7h26"><a href="http://app.nextretreat.com/">app.nextretreat.com</a></Td>
                            <Td class="tg-7zrl">Marketing</Td>
                            <Td class="tg-7zrl">This cookie is set by Drift.com for tracking purposes. According to the Drift documentation, this is the anonymous identifier token. It is used to tie the visitor on your website with the profile within the Drift system. This allows Drift to remember the information that this site visitor has provided through the chat on subsequent site visits.</Td>
                            <Td class="tg-7zrl">2 years</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">drift_aid</Td>
                            <Td class="tg-7zrl"></Td>
                            <Td class="tg-7h26"><a href="http://app.nextretreat.com/">app.nextretreat.com</a></Td>
                            <Td class="tg-7zrl">Other</Td>
                            <Td class="tg-7zrl">No description available.</Td>
                            <Td class="tg-7zrl">2 years</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">ugid</Td>
                            <Td class="tg-7zrl">Unsplash</Td>
                            <Td class="tg-7zrl">.unsplash.com</Td>
                            <Td class="tg-7zrl">Functional</Td>
                            <Td class="tg-7zrl">This cookie is set by the provider Unsplash. This cookie is used for enabling the video content on the website.</Td>
                            <Td class="tg-7zrl">1 year</Td>
                        </tr>
                        <tr>
                            <Td class="tg-7zrl">pvc_visits[0]</Td>
                            <Td class="tg-7zrl"></Td>
                            <Td class="tg-7h26"><a href="http://blog.nextretreat.com/">blog.nextretreat.com</a></Td>
                            <Td class="tg-7zrl">Other</Td>
                            <Td class="tg-7zrl">This cookie is created by post-views-counter. This cookie is used to count the number of visits to a post. It also helps in preventing repeat views of a post by a visitor.</Td>
                            <Td class="tg-7zrl">12 hours</Td>
                        </tr>
                    </tbody>
                </Table>
            </TableContainer>
        </>
    )
}

export default CookiesTable