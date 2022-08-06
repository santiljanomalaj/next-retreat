const path = require(`path`)

module.exports = {
  siteMetadata: {
    title: `NextRetreat | Bring Your Team Together – Team Retreats & Offsites`,
    description: `NextRetreat is streamlining the process of organising team travel. Find the right destination, book the perfect venue and get our help with everything else.`,
    author: `NextRetreat`,
    siteUrl: `https://www.nextretreat.com`,
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [
          {
            userAgent: '*',
            allow: '/',
            disallow: '/european-operation-program',
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        exclude: [`/european-operation-program`],
      },
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-root-import`,
      options: {
        components: path.join(__dirname, `src/components`),
        pages: path.join(__dirname, `src/pages`),
        src: path.join(__dirname, `src`),
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `NextRetreat | Bring Your Team Together – Team Retreats & Offsites.`,
        short_name: `NextRetreat`,
        start_url: `.`,
        background_color: `#175EDC`,
        theme_color: `#175EDC`,
        display: `standalone`,
        icon: `src/images/next-retreat-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /\.inline\.svg$/,
        },
      },
    },
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: process.env.GTM_ID || 'GTM-WB7VMZQ',
        // defaultDataLayer: { platform: "gatsby" },
        // includeInDevelopment: true,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
