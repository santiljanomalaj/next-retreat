const User = require('../models/User')
const UserSharedTrip = require('../models/UserSharedTrip.js')
const UserTrip = require('../models/UserTrip')
const { sendEmail } = require('../utils/email')
const { SENDGRID_EMAIL_TEMPLATE_IDS, NEXT_RETREAT_SUPPORT_EMAIL } = require('../constants')
const { createUser } = require('../utils/user')

// deautomation
const isDevelopment = process.env.NODE_ENV === 'development'

module.exports = {
  User: {
    trips: (user) => UserTrip.query().where({ userId: user.id }),
    sharedTrips: (user) => UserSharedTrip.query().where({ userId: user.id })
  },
  SharedTrips:{
    trips: (sharedTrips) => UserTrip.query().where({ id: sharedTrips.tripId }),
  },
  Query: {
    userMe: (_, __, { user }) => user,
  },
  Mutation: {
    signUp: async (_, { input }) => {
      let { trackingData } = input
      const email = input.email.trim().toLowerCase()
      let user = await User.query().findOne({ email })
      let userExists = true
      trackingData = trackingData || {}
      trackingData.uid = user ? user.id : null

      return User.transaction(async (trx) => {
        if (!user) {
          userExists = false
          user = await createUser(email, trackingData)
        }

        if (isDevelopment || user.isApproved) {
          let loginUrl = `${process.env.URL_SHORTENER_URL}${user.accessToken}`
          loginUrl = loginUrl.trim()

          await sendEmail({
            from: process.env.NEXT_RETREAT_EMAIL_ADDRESS,
            to: email,
            cc: (userExists && user.mlSent == true && !isDevelopment) ? null : NEXT_RETREAT_SUPPORT_EMAIL,
            templateId: (userExists && user.mlSent == true) ? SENDGRID_EMAIL_TEMPLATE_IDS.WELCOME_BACK_MAGIC_LINK : SENDGRID_EMAIL_TEMPLATE_IDS.REQUEST_LOGIN_LINK,
            dynamicTemplateData: {
              signInUrl: loginUrl,
            },
          })
        }
        return user
      })
    },
  },
}
