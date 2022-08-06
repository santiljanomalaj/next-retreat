const { sendEmail } = require('../utils/email')
const { SENDGRID_EMAIL_TEMPLATE_IDS } = require('../constants')

module.exports = {
  Mutation: {
    submitContactForm: async (_, { input }) => {
      try {
        await sendEmail({
          from: process.env.NEXT_RETREAT_EMAIL_ADDRESS,
          to: process.env.NEXT_RETREAT_EMAIL_ADDRESS,
          templateId: SENDGRID_EMAIL_TEMPLATE_IDS.CONTACT_US,
          dynamicTemplateData: { ...input },
        })
      } catch (error) {
        return false
      }
      return true
    },
  },
}
