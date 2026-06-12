module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email } = req.body || {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Everloom Labs <leads@everloomlabs.com>',
      to: ['everloomlabs@gmail.com'],
      subject: `New lead: ${email}`,
      html: `<p>New lead from the website:</p><p><strong>${email}</strong></p>`,
    }),
  });

  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send' });
  }

  return res.status(200).json({ ok: true });
};
