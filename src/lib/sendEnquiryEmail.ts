import { env } from './env';

interface EnquiryEmailParams {
  name: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  roomType?: string;
  roomName?: string;
  message?: string;
  source?: string;
  submissionId?: string;
}

export async function sendEnquiryEmail(params: EnquiryEmailParams): Promise<void> {
  const apiKey = env?.RESEND_API_KEY;
  const recipient = env?.CONTACT_FORM_RECIPIENT;

  if (!apiKey || !recipient) {
    console.warn('[sendEnquiryEmail] RESEND_API_KEY or CONTACT_FORM_RECIPIENT not set — skipping email');
    return;
  }

  const subject = `New Enquiry from ${params.name}${params.roomName ? ` — ${params.roomName}` : ''}`;

  const rows = [
    ['Phone', params.phone],
    ['Email', params.email || 'Not provided'],
    ['WhatsApp', params.whatsapp || params.phone],
    ['Room Interest', params.roomName || params.roomType || 'General enquiry'],
    ['Source', params.source || 'Website'],
    ['Submission ID', params.submissionId || '—'],
  ] as const;

  const rowsHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0 0 2px;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#9ab09f;font-weight:600;">${label}</p>
          <p style="margin:0;font-size:15px;color:#e8f0e8;">${value}</p>
        </td>
      </tr>`,
    )
    .join('');

  const messageHtml = params.message
    ? `<tr>
        <td style="padding-top:20px;">
          <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#9ab09f;font-weight:600;">Message</p>
          <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:16px;border-left:3px solid #c69c2e;">
            <p style="margin:0;font-size:15px;color:#e8f0e8;line-height:1.6;">${params.message.replace(/\n/g, '<br/>')}</p>
          </div>
        </td>
      </tr>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#0b2b13;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b2b13;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#132b1c;border-radius:16px;overflow:hidden;border:1px solid rgba(198,156,46,0.2);">
          <tr>
            <td style="background:linear-gradient(135deg,#1a3d22,#0f2318);padding:32px 40px;text-align:center;border-bottom:1px solid rgba(198,156,46,0.2);">
              <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:3px;color:#c69c2e;font-weight:600;">Ankit Da Mess</p>
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#fdfcf7;">New Enquiry Received</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:20px;">
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#c69c2e;font-weight:600;">From</p>
                    <p style="margin:0;font-size:20px;font-weight:700;color:#fdfcf7;">${params.name}</p>
                  </td>
                </tr>
                ${rowsHtml}
                ${messageHtml}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
              <a href="https://ankitdamess.in/admin/enquiries" style="display:inline-block;background:#c69c2e;color:#0b2b13;font-weight:700;font-size:14px;padding:12px 28px;border-radius:50px;text-decoration:none;">View in Admin Dashboard →</a>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 40px 24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#5a7560;">© ${new Date().getFullYear()} Ankit Da Mess · Fuljhore, Rabindra Pally, Durgapur 713206</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Ankit Da Mess <onboarding@resend.dev>',
        to: [recipient],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[sendEnquiryEmail] Resend error:', err);
    }
  } catch (err) {
    console.error('[sendEnquiryEmail] Network error:', err);
  }
}
