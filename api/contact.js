const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email } = req.body || {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Everloom Labs" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `New lead: ${email}`,
    html: `<p>New lead from the website:</p><p><strong>${email}</strong></p>`,
  });

  return res.status(200).json({ ok: true });
};
