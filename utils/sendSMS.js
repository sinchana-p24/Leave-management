// backend/utils/sendSMS.js
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = async function sendSMS({ to, body }) {
  return await client.messages.create({
    to,
    from: process.env.TWILIO_PHONE_NUMBER,
    body
  });
};
