/* eslint-disable camelcase */
const sendgrid = require('@sendgrid/mail')
const logger = require('../utils/logger')

const sendEmail = ({
  from = process.env.NEXT_RETREAT_EMAIL_ADDRESS,
  to = process.env.NEXT_RETREAT_EMAIL_ADDRESS,
  templateId,
  dynamicTemplateData: dynamic_template_data,
}) => {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY)
  try {
    const email = { to, from, templateId, dynamic_template_data }
    sendgrid.send(email)
  } catch (error) {
    logger.error('sendEmail', error)
    throw error
  }
}

module.exports = { sendEmail }
