const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  console.log('contact handler fired', req.method, JSON.stringify(req.body));

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email, message } = req.body || {};

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

  try {
    await transporter.sendMail({
      from: `"Everloom Labs" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New lead: ${email}`,
      html: `
        <p><strong>New lead from the Everloom Labs website</strong></p>
        <p><strong>Email:</strong> ${email}</p>
        ${message ? `<p><strong>Message:</strong></p><p style="white-space:pre-wrap">${message}</p>` : '<p><em>No message provided.</em></p>'}
      `,
    });
  } catch (err) {
    console.error('sendMail error:', err);
    return res.status(500).json({ error: 'Failed to send email', detail: err.message });
  }

  return res.status(200).json({ ok: true });
};
