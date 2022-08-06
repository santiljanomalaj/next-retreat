module.exports = [{
      plugin: require('../../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"Gatsby","short_name":"Gatsby","start_url":"/","background_color":"#6496f6","theme_color":"#000696","display":"minimal-ui","icon":"../common/static/favicon/favicon.png","legacy":true,"theme_color_in_head":true,"cache_busting_mode":"query","crossOrigin":"anonymous","include_favicon":true,"cacheDigest":"628ed049c38303aa8572e1005859c169"},
    },{
      plugin: require('../gatsby-browser.js'),
      options: {"plugins":[]},
    }]
