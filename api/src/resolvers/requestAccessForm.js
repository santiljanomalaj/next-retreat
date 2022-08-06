const { sendEmail } = require('../utils/email')
const User = require('../models/User')
const { SENDGRID_EMAIL_TEMPLATE_IDS } = require('../constants')
const { createUser } = require('../utils/user')

module.exports = {
  Mutation: {
    requestAccessForm: async (_, { input }) => {
      try {
        // create user in the database
        let { trackingData } = input
        const email = input.email.trim().toLowerCase()
        let user = await User.query().findOne({ email })
        trackingData = trackingData || {}
        trackingData.uid = user ? user.id : null

        return User.transaction(async (trx) => {
          if (!user) {
            user = await createUser(email, trackingData)
          }

          try {
            const sendEmailResponse = await sendEmail({
              from: process.env.NEXT_RETREAT_EMAIL_ADDRESS,
              to: process.env.NEXT_RETREAT_EMAIL_ADDRESS,
              templateId: SENDGRID_EMAIL_TEMPLATE_IDS.REQUEST_ACCESS,
              dynamicTemplateData: { trackingData: _, ...input },
            })
            console.log("sendEmailResponse", sendEmailResponse)
          } catch (e) {
            console.log("emailerror", e)
          }
          return user.id
        })
      } catch (error) {
        console.log(error)
        return false
      }
    },
  },
}
