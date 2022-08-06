
const User = require('../models/User')
const crypto = require('crypto')
const fetch = require('node-fetch')

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
const RANDOM_BYTES_LENGTH = 12

const convertToQueryString = (objectToConvert) => {
    let result = ''

    let keys = Object.keys(objectToConvert)

    keys.forEach(key => {
        if(objectToConvert[key] && objectToConvert[key] !== '') result += `&${key}=${objectToConvert[key]}`
    });

    return result
}

const createUser = async (email, trackingData = {}) => {
    let user

    await User.transaction(async (trx) => {
        const accessToken = crypto.randomBytes(RANDOM_BYTES_LENGTH).toString('hex')
        user = await User.query(trx).insert({
            email,
            accessToken,
            isApproved: IS_DEVELOPMENT,
            mlSent: IS_DEVELOPMENT,
        })

        trackingData.uid = user.id
        const queryParam = convertToQueryString(trackingData)

        await User.query(trx).where('id', '=', user.id).patch({ queryParam })

        //Crate short url
        const loginUrl = `${process.env.WEB_CLIENT_URL}/plan?token=${user.accessToken
            }${trackingData ? `${queryParam}` : ''}`

        await fetch(process.env.URL_SHORTENER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.URL_SHORTENER_KEY
            },
            body: JSON.stringify({
                id: user.accessToken,
                url: loginUrl
            })
        })
    })

    return user
}

module.exports = {
    createUser,
}